import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'src/keyword-wrapper.js',
  output: {
    file: 'libs/keyword.bundle.js',
    format: 'iife',
    name: 'KeywordBundle'
  },
  plugins: [
    nodeResolve(),
    // allow commonjs to resolve dynamic requires used by rake-js (stopwords loader)
    // Allow the CommonJS plugin to resolve the specific rake-js stopwords file
    // so Rollup will bundle it and avoid runtime `require` in the browser.
    commonjs({
      ignoreDynamicRequires: false,
      dynamicRequireTargets: [
        // match the stopwords file we added
        'node_modules/rake-js/dist/lib/stopwords/english.js'
      ]
    }),
    json()
  ]
};
