import React from 'react'
import { Button } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function ButtonPage() {
  return (
    <>
      <RSCChecker actualComponent={Button} />
      <Button />
    </>
  )
}
