import { ComponentPropsWithRef, ElementType } from 'react'

export type ElementRef<T extends ElementType> = ComponentPropsWithRef<T>['ref']

export type ElementRefProps<T extends ElementType> = { ref?: ElementRef<T> }
