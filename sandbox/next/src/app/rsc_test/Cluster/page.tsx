import React from 'react'
import { Cluster } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function ClusterPage() {
  return (
    <>
      <RSCChecker actualComponent={Cluster} />
      <Cluster />
    </>
  )
}
