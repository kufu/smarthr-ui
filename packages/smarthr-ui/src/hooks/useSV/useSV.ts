import { useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useEnvironment } from '../useEnvironment'

import type { Environment } from '../useEnvironment/useEnvironment'

// tailwind-variantsのslotsから型を抽出する型ヘルパー
type Slots<T> = T extends { slots: infer S }
  ? keyof S
  : T extends { base: infer B }
    ? B extends any[]
      ? never
      : B extends object
        ? keyof B
        : never
    : never

type SVReturnType<T> = Slots<T> extends never ? string : { [K in Slots<T>]: string }

export const defineSV = <T>(f: (environment: Environment) => T) => f

// VariantPropsの実装に必要な型ヘルパー
type ConfigVariants<T> = T extends { variants: infer V } ? V : object

type VariantValue<T> =
  T extends Record<string, any>
    ? 'true' extends keyof T
      ? boolean
      : 'false' extends keyof T
        ? boolean
        : keyof T
    : never

export type VariantProps<T extends (environment: Environment) => any> = {
  [K in keyof ConfigVariants<ReturnType<T>>]?: VariantValue<ConfigVariants<ReturnType<T>>[K]>
}

// TODO: propsのanyをTから導出できるようにする
export const useSV = <T extends Omit<Parameters<typeof tv>[0], 'base'>>(
  f: (environment: Environment) => T,
  props: any,
): SVReturnType<T> => {
  const environment = useEnvironment()

  const applyTV = useMemo(() => {
    const config = f(environment)

    // config.base がオブジェクトの場合は slots として扱う
    if ('base' in config && typeof config.base === 'object' && !Array.isArray(config.base)) {
      const { base, ...rest } = config
      return tv({
        slots: base,
        ...rest,
      })
    }
    return tv(config)
  }, [f, environment])

  const classNames = applyTV(props)

  if (typeof classNames === 'object' && classNames !== null && !Array.isArray(classNames)) {
    const ret: Record<string, string> = {}
    for (const key in classNames) {
      const value = classNames[key]
      ret[key] = typeof value === 'function' ? value() : value
    }
    return ret as SVReturnType<T>
  }
  return classNames as SVReturnType<T>
}
