import React from 'react'
import { UnexpectedErrorScreen } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function UnexpectedErrorScreenPage() {
  return (
    <>
      <RSCChecker actualComponent={UnexpectedErrorScreen} />
      <UnexpectedErrorScreen homeUrl="https://example.com" />
    </>
  )
}
