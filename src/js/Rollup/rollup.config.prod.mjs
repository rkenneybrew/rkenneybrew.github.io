// rollup.config.mjs
import json from '@rollup/plugin-json';

export default {
	input: 'main.js',
	output: {
		file: '@build/prod/prod.bundle.js',
		format: 'cjs'
	},
	plugins: [json()]
};
  