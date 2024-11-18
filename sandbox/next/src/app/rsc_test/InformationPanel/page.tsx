import React from 'react'
import { InformationPanel } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function InformationPanelPage() {
  return (
    <>
      <RSCChecker actualComponent={InformationPanel} />
      <InformationPanel title="title" />
    </>
  )
}
