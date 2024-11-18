import React from 'react'
import { FlashMessage } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function FlashMessagePage() {
  return (
    <>
      <RSCChecker actualComponent={FlashMessage} />
      <FlashMessage visible={true} type={'success'} text="text" onClose={() => {}} />
    </>
  )
}
