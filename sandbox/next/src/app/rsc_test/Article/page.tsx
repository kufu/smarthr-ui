import React from 'react'
import { Article } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function ArticlePage() {
  return (
    <>
      <RSCChecker actualComponent={Article} />
      <Article />
    </>
  )
}
