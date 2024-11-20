import React from 'react'
import { SmartHRLogo } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function SmartHRLogoPage() {
  return (
    <>
      <RSCChecker actualComponent={SmartHRLogo} />
      <SmartHRLogo fill="black" />
    </>
  )
}
