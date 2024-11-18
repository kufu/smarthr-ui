import React from 'react'
import { DefinitionListItem } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker'
export default function DefinitionListItemPage() {
  return (
    <>
      <RSCChecker actualComponent={DefinitionListItem} />
      <DefinitionListItem term="term" description="description" />
    </>
  )
}
