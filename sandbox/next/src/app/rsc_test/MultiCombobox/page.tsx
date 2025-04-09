import React from 'react'
import { MultiCombobox } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function MultiComboboxPage() {
  return (
    <>
      <RSCChecker actualComponent={MultiCombobox} />
      <MultiCombobox name="name" items={[]} selectedItems={[]} />
    </>
  )
}
