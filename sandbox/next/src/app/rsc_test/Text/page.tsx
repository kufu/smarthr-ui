import React from 'react'
import { Text } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function TextPage() {
  return (
    <>
      <RSCChecker actualComponent={Text} />
      <Text>Text</Text>
    </>
  )
}
