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

const entryPoints = globSync('src/**/*.{ts,tsx}', {
  ignore: [
    '**/*.stories.{ts,tsx}',
    '**/*.test.{ts,tsx}',
    '**/__tests__/*.{ts,tsx}',
  ],
})

/** @type {import('rollup').RollupOptions} */
export default {
	input: Object.fromEntries(
		entryPoints.map(file => [
			path.relative(
				'src',
        // 拡張子を除去し書き出し時に正しいファイルめになるようにしている
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
    // peerDependenciesにreactが入っているが、jsx-runtimeは明示的に指定しないとbundleされてしまうのでベタ書きしている
    'react/jsx-runtime',
    ...peerDependencies,
  ],
  // pnpm起因での問題がおきないようにしている
  preserveSymlinks: false,
  plugins: [
    typescript({
      tsconfig: './tsconfig.esm.build.json',
      noEmit: true,
    }),
    preserveDirectives(),
    commonjs(),
    nodeResolve(),
    // node_modulesのままだとimportできないケースがあったので、vendorにrenameしている
    renameNodeModules("vendor")
  ],
}
