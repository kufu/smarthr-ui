import React from 'react'
import { TextLink } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function TextLinkPage() {
  return (
    <>
      <RSCChecker actualComponent={TextLink} />
      <TextLink href="/">TextLink</TextLink>
    </>
  )
}
