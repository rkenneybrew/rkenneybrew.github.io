// rollup.config.mjs
import json from '@rollup/plugin-json';

export default {
	input: 'main.js',
	output: {
		file: '@build/name_this_prefix.bundle.js',
		format: 'cjs'
	},
	plugins: [json()]
};