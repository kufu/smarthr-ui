import type { ComponentPropsWithRef, ComponentPropsWithoutRef, ElementType, FC } from 'react'

export type ElementRef<T extends ElementType> = ComponentPropsWithRef<T>['ref']

export type ElementRefProps<T extends ElementType> = { ref?: ElementRef<T> }

export type PropsWithHTMLAttributes<
  Props extends Parameters<FC>[0],
  E extends ElementType,
> = Props & Omit<ComponentPropsWithoutRef<E>, keyof Props>
