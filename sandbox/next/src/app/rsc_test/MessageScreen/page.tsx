import React from 'react'
import { MessageScreen } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function MessageScreenPage() {
  return (
    <>
      <RSCChecker actualComponent={MessageScreen} />
      <MessageScreen />
    </>
  )
}
