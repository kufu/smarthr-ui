import { VFC, useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { MultiComboBox, SingleComboBox } from './'

export function useClassNames() {
  const generateForSingle = useClassNameGenerator(
    (SingleComboBox as VFC).displayName || 'SingleComboBox',
  )
  const generateForMulti = useClassNameGenerator(
    (MultiComboBox as VFC).displayName || 'MultiComboBox',
  )
  return useMemo(
    () => ({
      single: {
        wrapper: generateForSingle(),
        input: generateForSingle('input'),
        clearButton: generateForSingle('clearButton'),
        listBox: {
          dropdownList: generateForSingle('dropdownList'),
          addButton: generateForSingle('addButton'),
          selectButton: generateForSingle('selectButton'),
          noItems: generateForSingle('noItems'),
        },
      },
      multi: {
        wrapper: generateForMulti(),
        selectedItem: generateForMulti('selectedItem'),
        selectedItemLabel: generateForMulti('selectedItemLabel'),
        deleteButton: generateForMulti('deleteButton'),
        input: generateForMulti('input'),
        placeholder: generateForMulti('placeholder'),
        listBox: {
          dropdownList: generateForMulti('dropdownList'),
          addButton: generateForMulti('addButton'),
          selectButton: generateForMulti('selectButton'),
          noItems: generateForMulti('noItems'),
        },
      },
    }),
    [generateForMulti, generateForSingle],
  )
}
