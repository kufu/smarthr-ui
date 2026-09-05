import React from 'react'
import { NotFoundErrorScreen } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function NotFoundErrorScreenPage() {
  return (
    <>
      <RSCChecker actualComponent={NotFoundErrorScreen} />
      <NotFoundErrorScreen homeUrl="https://example.com" />
    </>
  )
}
