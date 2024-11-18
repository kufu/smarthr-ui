import React from 'react'
import { NotificationBar } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function NotificationBarPage() {
  return (
    <>
      <RSCChecker actualComponent={NotificationBar} />
      <NotificationBar type="info" message="message" />
    </>
  )
}
