import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../../hooks/useTheme';
import { FlashMessageListContext } from './FlashMessageListProvider';
import { Item } from './Item';
export const FlashMessageList = () => {
    const theme = useTheme();
    const { messages } = useContext(FlashMessageListContext);
    return (React.createElement(List, { themes: theme }, messages.map((message) => (React.createElement(Item, { ...message, key: message.seq })))));
};
const List = styled.ul `
  ${({ themes: { spacingByChar, zIndex } }) => css `
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
`;
//# sourceMappingURL=FlashMessageList.js.map