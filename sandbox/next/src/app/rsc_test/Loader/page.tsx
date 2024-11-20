import React from 'react'
import { Loader } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function LoaderPage() {
  return (
    <>
      <RSCChecker actualComponent={Loader} />
      <Loader />
    </>
  )
}
