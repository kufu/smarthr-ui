import React from 'react'
import { ForbiddenErrorScreen } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function ForbiddenErrorScreenPage() {
  return (
    <>
      <RSCChecker actualComponent={ForbiddenErrorScreen} />
      <ForbiddenErrorScreen homeUrl="https://example.com" />
    </>
  )
}
