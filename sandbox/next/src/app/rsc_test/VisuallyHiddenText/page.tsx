import React from 'react'
import { VisuallyHiddenText } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function VisuallyHiddenTextPage() {
  return (
    <>
      <RSCChecker actualComponent={VisuallyHiddenText} />
      <VisuallyHiddenText>VisuallyHiddenText</VisuallyHiddenText>
    </>
  )
}
