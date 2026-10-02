import type { ComponentPropsWithRef, ElementType } from 'react'

export type ElementRef<T extends ElementType> = ComponentPropsWithRef<T>['ref']
