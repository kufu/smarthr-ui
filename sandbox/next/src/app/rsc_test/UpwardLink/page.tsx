import React from 'react'
import { UpwardLink } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function UpwardLinkPage() {
  return (
    <>
      <RSCChecker actualComponent={UpwardLink} />
      <UpwardLink href="/">UpwardLink</UpwardLink>
    </>
  )
}
