import { useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useEnvironment } from '../useEnvironment'

type SVContext = {
  mobile: boolean
}

type GetSlots<T> = T extends { slots: infer S }
  ? keyof S
  : T extends { base: infer B }
    ? B extends any[]
      ? never
      : B extends object
        ? keyof B
        : never
    : never

type SVReturnType<T> = GetSlots<T> extends never ? string : { [K in GetSlots<T>]: string }

export const defineSV = <T>(fn: (context: SVContext) => T) => fn

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

export type VariantProps<T extends (context: SVContext) => any> = {
  [K in keyof ConfigVariants<ReturnType<T>>]?: VariantValue<ConfigVariants<ReturnType<T>>[K]>
}

export const useSV = <T>(definition: (context: SVContext) => T, props: any): SVReturnType<T> => {
  const { mobile } = useEnvironment()

  const styleFn = useMemo(() => {
    const config = definition({ mobile })

    // config.base がオブジェクトの場合は slots として扱う
    if (
      typeof config === 'object' &&
      config !== null &&
      !Array.isArray(config) &&
      'base' in config &&
      typeof (config as any).base === 'object' &&
      !Array.isArray((config as any).base)
    ) {
      const { base, ...rest } = config as any
      return tv({
        slots: base,
        ...rest,
      })
    }

    return tv(config as any)
  }, [definition, mobile])

  const result = styleFn(props)

  if (typeof result === 'object' && result !== null && !Array.isArray(result)) {
    const resolvedResult: Record<string, string> = {}
    const resultObj = result as Record<string, any>
    for (const key in resultObj) {
      const value = resultObj[key]
      if (typeof value === 'function') {
        resolvedResult[key] = value()
      } else {
        resolvedResult[key] = value
      }
    }
    return resolvedResult as SVReturnType<T>
  }

  return result as SVReturnType<T>
}
