import React from 'react'
import { Sidebar } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function SidebarPage() {
  return (
    <>
      <RSCChecker actualComponent={Sidebar} />
      <Sidebar />
    </>
  )
}
