import React from 'react'
import { CheckBox } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function CheckBoxPage() {
  return (
    <>
      <RSCChecker actualComponent={CheckBox} />
      <CheckBox />
    </>
  )
}
