import React from 'react'
import { LanguageSwitcher } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function LanguageSwitcherPage() {
  return (
    <>
      <RSCChecker actualComponent={LanguageSwitcher} />
      <LanguageSwitcher localeMap={{}} />
    </>
  )
}
