import React, { VFC, useContext } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../../hooks/useTheme'

import { FlashMessageListContext } from './FlashMessageListProvider'
import { Item } from './Item'

export const FlashMessageList: VFC = () => {
  const theme = useTheme()
  const { messages } = useContext(FlashMessageListContext)

  return (
    <List themes={theme}>
      {messages.map((message) => (
        <Item {...message} key={message.seq} />
      ))}
    </List>
  )
}

const List = styled.ul<{ themes: Theme }>`
  ${({ themes: { spacingByChar, zIndex } }) => css`
    z-index: ${zIndex.FLASH_MESSAGE};
    position: fixed;
    display: flex;
    flex-direction: column-reverse;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: ${spacingByChar(0.5)};
    list-style: none;
  `}
`
