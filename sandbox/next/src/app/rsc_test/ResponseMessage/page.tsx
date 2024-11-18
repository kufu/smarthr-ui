import React from 'react'
import { ResponseMessage } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function ResponseMessagePage() {
  return (
    <>
      <RSCChecker actualComponent={ResponseMessage} />
      <ResponseMessage>ResponseMessage</ResponseMessage>
    </>
  )
}
