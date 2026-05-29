import type { ComponentPropsWithRef, ComponentPropsWithoutRef, ElementType } from 'react'

export type ElementRef<T extends ElementType> = ComponentPropsWithRef<T>['ref']

export type ElementRefProps<T extends ElementType> = { ref?: ElementRef<T> }

export type PropsWithHTMLAttributes<Props, E extends ElementType> = Props &
  Omit<ComponentPropsWithoutRef<E>, keyof Props>
