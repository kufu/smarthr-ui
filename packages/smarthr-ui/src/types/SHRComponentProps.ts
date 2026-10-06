import type { ComponentPropsWithRef, ComponentPropsWithoutRef, ElementType } from 'react'

export type SHRComponentProps<Base, Additional> = Additional & Omit<Base, keyof Additional>

type OmitKey<Options> = Options extends { omit: infer K extends PropertyKey } ? K : never

export type SHRComponentPropsWithRef<
  Base extends ElementType,
  Additional,
  Options extends { omit?: PropertyKey } = object,
> = SHRComponentProps<Omit<ComponentPropsWithRef<Base>, OmitKey<Options>>, Additional>

export type SHRComponentPropsWithoutRef<
  Base extends ElementType,
  Additional,
  Options extends { omit?: PropertyKey } = object,
> = SHRComponentProps<Omit<ComponentPropsWithoutRef<Base>, OmitKey<Options>>, Additional>
