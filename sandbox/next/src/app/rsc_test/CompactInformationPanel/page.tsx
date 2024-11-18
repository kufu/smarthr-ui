import React from 'react'
import { CompactInformationPanel } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function CompactInformationPanelPage() {
  return (
    <>
      <RSCChecker actualComponent={CompactInformationPanel} />
      <CompactInformationPanel />
    </>
  )
}
