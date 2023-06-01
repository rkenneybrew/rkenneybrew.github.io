"use strict";

/* eslint-disable complexity, max-statements, no-magic-numbers, prefer-template, prefer-spread */

const assert = require("assert");
const chalk = require("chalk");

//
// convert color markers in a string to terminal/ansi color codes with chalk
// color marker format is "<red>red text</red><blue.bold>blue bold text</blue.bold>"
// the end marker can simply be "</>" also
// the marker is converted to chalk methods directly, for example:
// - chalk.red is called for "<red>"
// - chalk.blue.bold is called for "<blue.bold>"
//
// More advanced colors can be applied with:
//
// <(r,g,b)>, <rgb(255,10,20)>
// <bg(r,g,b)>, <bgRgb(255,10,20)>
// <#FF0000>, <bg#0000FF>, <hex(#FF0000)>, <bgHex(#0000FF)>
// <(orange)>, <keyword(orange)>, <keyword('orange')>,
//    <keyword("orange")>, <keyword(`orange`)>
// <bg(orange)>, <bgKeyword(orange)>, <bgKeyword('orange')>,
//    <bgKeyword("orange")>, <bgKeyword(`orange`)>
// <hsl(32,100,50)>, <hsv(32,100,100)>, <hwb(32,0,50)>
//
// any thing that's not found as a basic color is tried using chalk.keyword
//
// <orange>, <'orange'>, <"orange">, <`orange`>
//
// If it's prefixed with `"bg-"` or `"bg "` then it's tried using chalk.bgKeyword
//
// <bg-orange>, <bg orange>
//
// These can be comined with . in any order as long as they work with chalk
//
// ie: <#FF0000.bg#0000FF.orange.keyword()>
//

function deQuote(str, marker) {
  const q = str[0];
  if (q === `'` || q === `"` || q === "`") {
    // remove enclosing quotes ', ", or ` if they are present
    assert(str.endsWith(q), `chalk ${marker} param must be enclosed with matching quote ${q}`);
    str = str.substr(1, str.length - 2);
  }

  return str;
}

// https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references
// https://en.wikipedia.org/wiki/Universal_Coded_Character_Set

const htmlEntities = {
  [`&quot;`]: `"`,
  [`&amp;`]: "&",
  [`&apos;`]: "'",
  [`&lt;`]: "<",
  [`&gt;`]: ">",
  [`&nbsp;`]: "\xa0",
  [`&copy;`]: "\xa9",
  [`&reg;`]: "\xae"
};

function decodeHtml(str) {
  return str.replace(/&[\w#]+;/g, m => {
    if (htmlEntities.hasOwnProperty(m)) return htmlEntities[m];
    if (m.startsWith("&#x")) {
      const s = m.substring(3, m.length - 1);
      const p = parseInt(s, 16);
      return String.fromCodePoint(p);
    }
    if (m.startsWith("&#")) {
      const s = m.substring(2, m.length - 1);
      const p = parseInt(s, 10);
      return String.fromCodePoint(p);
    }
    return m;
  });
}

function applyChalkMarkers(markers, text, userChalk) {
  const chalkify = markers
    .trim()
    .split(".")
    .reduce((a, marker) => {
      marker = marker.trim();

      if (a[marker]) {
        // a basic color found
        return a[marker];
      } else if (marker.startsWith("#")) {
        // a hex value
        return a.hex(marker);
      } else if ((marker[2] === "#" || marker[3] === "#") && marker.startsWith("bg")) {
        // a bgHex value, `bg#`, `bg-#`, `bg #`
        // no need to extract only the #HHHHHH part since chalk seems to deal with
        // the value in the form of text#HHHHHH
        return a.bgHex(marker);
      }

      const openIx = marker.indexOf("(");
      if (openIx >= 0) {
        // apply other advanced colors when ( is found
        const closeIx = marker.lastIndexOf(")");
        assert(closeIx > openIx, `marker ${marker} missing matching ()`);

        // extract name if there're something before (
        let name = openIx > 0 && marker.substring(0, openIx).trim();

        // extract values within ()
        let values = marker.substring(openIx + 1, closeIx).trim();
        if (values.indexOf(",") >= 0) {
          // extract rgb/hsl/hsv/hwb values like (255, 10, 20)
          values = values.split(",").map(x => parseInt(x.trim(), 10));

          // default no name to rgb, and bg to bgRgb
          if (!name) name = "rgb";
          else if (name === "bg") name = "bgRgb";
        } else {
          // extract a string (with or without quotes) to use for keyword
          values = [deQuote(values.trim(), marker)];

          // default no name to keyword, and bg to bgKeyword
          if (!name) name = "keyword";
          else if (name === "bg") name = "bgKeyword";
        }

        try {
          a = a[name].apply(a, values);
        } catch (err) {
          const msg =
            typeof a[name] !== "function"
              ? `${name} is not a chalk function`
              : `calling chalk.${name} failed with: ${err.message}`;

          throw new Error(`marker ${marker} is invalid: ${msg}`);
        }
      } else {
        // if not found as a basic color, then try with chalk.keyword or chalk.bgKeyword
        try {
          const kw = deQuote(marker, marker);
          if (kw.startsWith("bg-") || kw.startsWith("bg ")) {
            a = a.bgKeyword(kw.substring(3));
          } else {
            a = a.keyword(kw);
          }
        } catch (err) {
          throw new Error(`marker ${marker} is not found and invalid as a keyword`);
        }
      }

      assert(a, `marker ${marker} is invalid`);

      return a;
    }, userChalk);

  assert(
    typeof chalkify === "function",
    `final chalk value is not a function after applying ${markers}`
  );

  return chalkify(text);
}

// remove the color marker like <red>text</> from strings
function remove(s, keepHtml) {
  const r = s.replace(/<[^>]*>/g, "").trim();
  return keepHtml ? r : decodeHtml(r);
}

function format(s, userChalk) {
  userChalk = userChalk || chalk;

  // skip applying ansi colors if chalk says color support is off
  if (userChalk.supportsColor === false) {
    return remove(s);
  }

  const tks = s && s.match(/(<[^>]+>|[^<>]+)/g);

  // empty string "" result in null from match
  // but other strings w/o matches gets ['original-string']
  if (!tks) return s || "";

  const colorized = tks.reduceRight(
    (a, e, ix) => {
      const lvl = a[a.length - 1];

      // text
      if (e[0] !== "<") {
        lvl.s = e + lvl.s;
        return a;
      }

      // close marker
      if (e[1] === "/") {
        a.push({ mk: e.substring(2, e.length - 1), ix, s: "" });
        return a;
      }

      // open marker

      // markers balance check
      if (a.length === 1) {
        const partial =
          tks.slice(0, ix).join("") + `[${tks[ix]}]` + (tks.length > ix + 1 ? "..." : "");
        throw new Error(`unbalanced open/close markers: ${partial}`);
      }

      // markers match check
      const mk = e.substring(1, e.length - 1);
      if (lvl.mk && mk !== lvl.mk) {
        const partial =
          tks.slice(0, ix).join("") +
          `[** ${tks[ix]} **]` +
          tks.slice(ix + 1, lvl.ix).join("") +
          `[** ${tks[lvl.ix]} **]`;
        throw new Error(`mismatch markers: ${partial}`);
      }

      // apply marker and update result at previous level
      const t = applyChalkMarkers(mk, lvl.s, userChalk);
      a.pop();
      const nl = a.length - 1;
      a[nl].s = t + a[nl].s;

      return a;
    },
    [{ s: "" }]
  );

  return decodeHtml(colorized[0].s);
}

function chalker(s, ...args) {
  if (Array.isArray(s)) {
    // template string tagging
    let c = "";
    let ix;
    for (ix = 0; ix < args.length; ix++) {
      c = c + s[ix] + args[ix];
    }
    return format(c + s[ix]);
  }

  return format(s, ...args);
}

chalker.remove = remove;

chalker.decodeHtml = decodeHtml;

module.exports = chalker;
