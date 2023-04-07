export type ComboBoxItem<T> = {
  value: string
  // label: U extends string ? U : React.ReactNode
  // label: U
  label: React.ReactNode
  disabled?: boolean
  data?: T
}

export type ComboBoxOption<T> = {
  id: string
  selected: boolean
  isNew: boolean
  item: ComboBoxItem<T>
}
