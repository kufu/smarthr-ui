import React from 'react'
import { SingleComboBox } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function SingleComboBoxPage() {
  return (
    <>
      <RSCChecker actualComponent={SingleComboBox} />
      <SingleComboBox name="name" items={[]} selectedItem={null} />
    </>
  )
}
