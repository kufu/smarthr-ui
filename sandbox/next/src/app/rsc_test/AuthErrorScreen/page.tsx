import React from 'react'
import { AuthErrorScreen } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function AuthErrorScreenPage() {
  return (
    <>
      <RSCChecker actualComponent={AuthErrorScreen} />
      <AuthErrorScreen smarthrUrl="https://example.com" />
    </>
  )
}
