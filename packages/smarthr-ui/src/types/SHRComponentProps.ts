import type { ComponentPropsWithRef, ComponentPropsWithoutRef, ElementType } from 'react'

type OmitKey<Options> = Options extends { omit: infer K extends PropertyKey } ? K : never

export type SHRComponentProps<
  Base,
  Additional,
  Options extends { omit?: PropertyKey } = object,
> = Additional & Omit<Base, keyof Additional | OmitKey<Options>>

export type SHRComponentPropsWithRef<
  Base extends ElementType,
  Additional,
  Options extends { omit?: PropertyKey } = object,
> = SHRComponentProps<ComponentPropsWithRef<Base>, Additional, Options>

export type SHRComponentPropsWithoutRef<
  Base extends ElementType,
  Additional,
  Options extends { omit?: PropertyKey } = object,
> = SHRComponentProps<ComponentPropsWithoutRef<Base>, Additional, Options>
