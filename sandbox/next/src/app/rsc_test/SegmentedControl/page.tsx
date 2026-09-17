import React from 'react'
import { SegmentedControl } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function SegmentedControlPage() {
  return (
    <>
      <RSCChecker actualComponent={SegmentedControl} />
      <SegmentedControl options={[]} />
    </>
  )
}
