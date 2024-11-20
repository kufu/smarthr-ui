import React from 'react'
import { HeaderLink } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function HeaderLinkPage() {
  return (
    <>
      <RSCChecker actualComponent={HeaderLink} />
      <HeaderLink href="/">HeaderLink</HeaderLink>
    </>
  )
}
