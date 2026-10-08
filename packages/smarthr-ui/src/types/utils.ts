export type RequiredProps<Base, K extends keyof Base> = Omit<Base, K> & Required<Pick<Base, K>>

export type RenameProps<Base, Mapping extends Partial<Record<keyof Base, PropertyKey>>> = {
  [
    K in keyof Base as K extends keyof Mapping
      ? Mapping[K] extends PropertyKey
        ? Mapping[K]
        : never
      : K
  ]: Base[K]
}
