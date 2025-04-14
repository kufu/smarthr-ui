import React from 'react'
import { SingleCombobox } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function SingleComboboxPage() {
  return (
    <>
      <RSCChecker actualComponent={SingleCombobox} />
      <SingleCombobox name="name" items={[]} selectedItem={null} />
    </>
  )
}
