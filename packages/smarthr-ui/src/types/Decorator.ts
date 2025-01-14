import { ReactNode } from 'react'

export type DecoratorsType<T extends string> = {
  [K in T]?: DecoratorType
}

export type DecoratorType = (text: string) => ReactNode

export const executeDecorator = (defaultText: string, decorator: DecoratorType | undefined) =>
  decorator?.(defaultText) || defaultText
