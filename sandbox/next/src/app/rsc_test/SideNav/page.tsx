import React from 'react'
import { SideNav } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function SideNavPage() {
  return (
    <>
      <RSCChecker actualComponent={SideNav} />
      <SideNav items={[]} />
    </>
  )
}
