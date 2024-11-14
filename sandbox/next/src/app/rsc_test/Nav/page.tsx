import React from 'react'
import { Nav } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function NavPage() {
  return (
    <>
      <RSCChecker actualComponent={Nav} />
      <Nav />
    </>
  )
}
