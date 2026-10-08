export type RequiredProps<Base, K extends keyof Base> = Omit<Base, K> & Required<Pick<Base, K>>

export type RenameProps<Base, Mapping extends Record<PropertyKey, keyof Base>> = Omit<
  Base,
  Mapping[keyof Mapping]
> & {
  [K in keyof Mapping as undefined extends Base[Mapping[K]] ? never : K]: Base[Mapping[K]]
} & {
  [K in keyof Mapping as undefined extends Base[Mapping[K]] ? K : never]?: Base[Mapping[K]]
}
