import React from 'react'
import { SearchInput } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function SearchInputPage() {
  return (
    <>
      <RSCChecker actualComponent={SearchInput} />
      <SearchInput name="name" tooltipMessage="message" />
    </>
  )
}
