import React from 'react'
import { Header } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function HeaderPage() {
  return (
    <>
      <RSCChecker actualComponent={Header} />
      <Header />
    </>
  )
}
