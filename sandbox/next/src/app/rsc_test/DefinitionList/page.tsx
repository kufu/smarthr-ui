import React from 'react'
import { DefinitionList } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function DefinitionListPage() {
  return (
    <>
      <RSCChecker actualComponent={DefinitionList} />
      <DefinitionList items={[]} />
    </>
  )
}
