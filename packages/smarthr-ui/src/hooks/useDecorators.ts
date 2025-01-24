import { ReactNode, useMemo } from 'react'

export type DecoratorsType<T extends string> = {
  [K in T]?: DecoratorType
}

export type DecoratorType = (text: string) => ReactNode

export const useDecorators = <T extends string>(
  defaultTexts: { [K in T]: string },
  decorators: DecoratorsType<T> | undefined,
) =>
  useMemo(() => {
    if (!decorators) {
      return defaultTexts
    }

    const decorated = {} as { [K in T]: ReactNode }

    for (const key in defaultTexts) {
      const value = defaultTexts[key]

      decorated[key] = decorators[key]?.(value) || value
    }

    return decorated
  }, [decorators, defaultTexts])
