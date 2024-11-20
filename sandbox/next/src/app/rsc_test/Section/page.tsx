import React from 'react'
import { Section } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function SectionPage() {
  return (
    <>
      <RSCChecker actualComponent={Section} />
      <Section />
    </>
  )
}
