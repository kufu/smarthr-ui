import type { ComponentPropsWithRef, ComponentPropsWithoutRef, ElementType } from 'react'

type SHRComponentProps<Base, Additional> = Additional & Omit<Base, keyof Additional>
export type SHRComponentPropsWithRef<Base extends ElementType, Additional> = SHRComponentProps<
  ComponentPropsWithRef<Base>,
  Additional
>
export type SHRComponentPropsWithoutRef<Base extends ElementType, Additional> = SHRComponentProps<
  ComponentPropsWithoutRef<Base>,
  Additional
>
