'use client'

import React, { useState } from 'react'
import { UnauthorizedErrorScreen } from 'smarthr-ui'

export function ClientCaller() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <UnauthorizedErrorScreen
      onClickLogin={() => setIsLoading(true)}
      isLoading={isLoading}
    />
  )
}
