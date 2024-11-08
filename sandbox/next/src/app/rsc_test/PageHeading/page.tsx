import React from 'react'
import { PageHeading } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function PageHeadingPage() {
  return (
    <>
      <RSCChecker actualComponent={PageHeading} />
      <PageHeading />
    </>
  )
}
