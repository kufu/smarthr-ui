import React from 'react'
import { UnauthorizedErrorScreen } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
import { ClientCaller } from './ClientCaller'

export default function UnauthorizedErrorScreenPage() {
  return (
    <>
      <RSCChecker actualComponent={UnauthorizedErrorScreen} />
      <ClientCaller />
    </>
  )
}
