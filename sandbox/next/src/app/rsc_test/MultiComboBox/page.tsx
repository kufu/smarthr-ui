import React from 'react'
import { MultiComboBox } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function MultiComboBoxPage() {
  return (
    <>
      <RSCChecker actualComponent={MultiComboBox} />
      <MultiComboBox name="name" items={[]} selectedItems={[]} />
    </>
  )
}
