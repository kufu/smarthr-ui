import React from 'react'
import { FlashMessage } from 'smarthr-ui'
export default function FlashMessagePage() {
  return (
    <>
      <div>Success: FlashMessage</div>
      <FlashMessage visible={true} type={'success'} text="text" onClose={() => {}} />
    </>
  )
}
