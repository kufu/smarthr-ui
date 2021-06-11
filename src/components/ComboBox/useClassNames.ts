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
  const generateForCommon = useClassNameGenerator('ComboBox')
  return useMemo(
    () => ({
      single: {
        wrapper: generateForSingle(),
        input: generateForSingle('input'),
        clearButton: generateForSingle('clearButton'),
      },
      multi: {
        wrapper: generateForMulti(),
        selectedItem: generateForMulti('selectedItem'),
        selectedItemLabel: generateForMulti('selectedItemLabel'),
        deleteButton: generateForMulti('deleteButton'),
        input: generateForMulti('input'),
        placeholder: generateForMulti('placeholder'),
      },
      common: {
        dropdownList: generateForCommon('dropdownList'),
        addButton: generateForCommon('addButton'),
        selectButton: generateForCommon('selectButton'),
        noItems: generateForCommon('noItems'),
      },
    }),
    [generateForCommon, generateForMulti, generateForSingle],
  )
}
