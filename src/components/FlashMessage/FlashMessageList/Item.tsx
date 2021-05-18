import React, { VFC, useCallback, useContext } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../../hooks/useTheme'
import { FlashMessage } from '../FlashMessage'
import { FlashMessageListContext, NumberedMessage } from './FlashMessageListProvider'

export const Item: VFC<NumberedMessage> = ({ seq, ...message }) => {
  const theme = useTheme()
  const { dequeueMessage } = useContext(FlashMessageListContext)

  const handleClose = useCallback(() => {
    dequeueMessage(seq)
  }, [dequeueMessage, seq])

  return (
    <Li themes={theme}>
      <StaticFlashMessage {...message} visible onClose={handleClose} />
    </Li>
  )
}

const Li = styled.li<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    margin-top: ${spacingByChar(0.5)};
  `}
`
const StaticFlashMessage = styled(FlashMessage)`
  position: static;
  display: inline-flex;
  top: auto;
  left: auto;
`
