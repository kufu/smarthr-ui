export type RequiredProps<Base, K extends keyof Base> = Omit<Base, K> & Required<Pick<Base, K>>
