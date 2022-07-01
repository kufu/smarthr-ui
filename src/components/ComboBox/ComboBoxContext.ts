import { createContext } from 'react'

type ComboBoxContextType = {
  listBoxClassNames: {
    dropdownList: string
    addButton: string
    selectButton: string
    noItems: string
  }
}

export const ComboBoxContext = createContext<ComboBoxContextType>({
  listBoxClassNames: {
    dropdownList: '',
    addButton: '',
    selectButton: '',
    noItems: '',
  },
})
