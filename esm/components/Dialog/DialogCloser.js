import React, { useContext } from 'react';
import styled from 'styled-components';
import { DialogContentContext } from './DialogContent';
export const DialogCloser = ({ children }) => {
    const { onClickClose } = useContext(DialogContentContext);
    return React.createElement(Wrapper, { onClick: onClickClose }, children);
};
const Wrapper = styled.div `
  display: inline-block;
`;
//# sourceMappingURL=DialogCloser.js.map