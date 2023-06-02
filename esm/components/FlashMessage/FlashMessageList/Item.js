import React, { useCallback, useContext } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../../hooks/useTheme';
import { FlashMessage } from '../FlashMessage';
import { FlashMessageListContext } from './FlashMessageListProvider';
export const Item = ({ seq, ...message }) => {
    const theme = useTheme();
    const { dequeueMessage } = useContext(FlashMessageListContext);
    const handleClose = useCallback(() => {
        dequeueMessage(seq);
    }, [dequeueMessage, seq]);
    return (React.createElement(Li, { themes: theme },
        React.createElement(StaticFlashMessage, { ...message, visible: true, onClose: handleClose })));
};
const Li = styled.li `
  ${({ themes: { spacingByChar } }) => css `
    margin-top: ${spacingByChar(0.5)};
  `}
`;
const StaticFlashMessage = styled(FlashMessage) `
  position: static;
  display: inline-flex;
  top: auto;
  left: auto;
`;
//# sourceMappingURL=Item.js.map