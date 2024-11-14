import React from 'react'
import { AppNaviCustomTag, Text } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function AppNaviCustomTagPage() {
  return (
    <>
      <RSCChecker actualComponent={AppNaviCustomTag} />
      <AppNaviCustomTag tag={Text}></AppNaviCustomTag>
    </>
  )
}
