import React from 'react'
import { FaAddressBookIcon } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker'
export default function IconPage() {
  return (
    <>
      <RSCChecker actualComponent={FaAddressBookIcon} />
      <FaAddressBookIcon />
    </>
  )
}
