// rollup.config.mjs
import json from '@rollup/plugin-json';

export default {
	input: 'main.js',
	output: {
		file: '@build/dev/dev.bundle.js',
		format: 'cjs'
	},
	plugins: [json()]
};
  