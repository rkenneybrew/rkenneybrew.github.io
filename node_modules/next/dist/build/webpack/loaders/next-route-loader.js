"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getRouteLoaderEntry: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getRouteLoaderEntry: function() {
        return getRouteLoaderEntry;
    },
    default: function() {
        return _default;
    }
});
const _querystring = require("querystring");
const _getmodulebuildinfo = require("./get-module-build-info");
function getRouteLoaderEntry(query) {
    return `next-route-loader?${(0, _querystring.stringify)(query)}!`;
}
/**
 * Handles the `next-route-loader` options.
 * @returns the loader definition function
 */ const loader = function() {
    const { page , preferredRegion , absolutePagePath  } = this.getOptions();
    // Ensure we only run this loader for as a module.
    if (!this._module) {
        throw new Error("Invariant: expected this to reference a module");
    }
    // Attach build info to the module.
    const buildInfo = (0, _getmodulebuildinfo.getModuleBuildInfo)(this._module);
    buildInfo.route = {
        page,
        absolutePagePath,
        preferredRegion
    };
    return `
        // Next.js Route Loader
        export * from ${JSON.stringify(absolutePagePath)}
        export { default } from ${JSON.stringify(absolutePagePath)}
    `;
};
const _default = loader;

//# sourceMappingURL=next-route-loader.js.map