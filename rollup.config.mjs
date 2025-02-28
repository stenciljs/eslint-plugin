import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  plugins: [
    nodeResolve({
      preferBuiltins: true
    })
  ],
  treeshake: {
    moduleSideEffects: 'no-external'
  },
  external: [
    'eslint',
    'typescript',
    'tsutils',
    'eslint-utils',
    'eslint-plugin-react'
  ],
  output: {
    dir: 'dist',
    format: 'esm'
  },
  plugins: [typescript()]
};
