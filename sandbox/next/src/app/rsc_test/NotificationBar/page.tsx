import React from 'react'
import { NotificationBar } from 'smarthr-ui'
export default function NotificationBarPage() {
  return (
    <>
      <div>Success: NotificationBar</div>
      <NotificationBar type="info" message="message" />
    </>
  )
}
