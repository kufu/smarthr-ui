import typescript from '@rollup/plugin-typescript';
import preserveDirectives from "rollup-plugin-preserve-directives";
import renameNodeModules from "rollup-plugin-rename-node-modules";
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { globSync } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import packageJson from './package.json' with { type: "json" }

const peerDependencies = packageJson.peerDependencies
  ? Object.keys(packageJson.peerDependencies)
  : []

const dependencies = packageJson.dependencies
  ? Object.keys(packageJson.dependencies)
  : []

const entryPoints = globSync('src/**/*.{ts,tsx}', {
  ignore: [
    '**/*.stories.{ts,tsx}',
    '**/*.test.{ts,tsx}',
    '**/__tests__/*.{ts,tsx}',
  ],
})

export default {
	input: Object.fromEntries(
		entryPoints.map(file => [
			path.relative(
				'src',
				file.slice(0, file.length - path.extname(file).length)
			),
			fileURLToPath(new URL(file, import.meta.url))
		])
	),
  output: {
    format: 'es',
    sourcemap: true,
    dir: 'esm',
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
  external: [
    'react/jsx-runtime',
    ...peerDependencies,
  ],
  preserveSymlinks: false,
  plugins: [
    typescript({
      tsconfig: './tsconfig.esm.build.json',
      noEmit: true,
    }),
    preserveDirectives(),
    commonjs(),
    nodeResolve(),
    renameNodeModules("vendor")
  ],
}
