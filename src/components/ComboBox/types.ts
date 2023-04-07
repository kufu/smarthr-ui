export type ComboBoxItem<T> = {
  value: string
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
