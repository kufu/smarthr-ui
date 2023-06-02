import React, { useContext } from 'react';
import styled from 'styled-components';
import { DialogContext } from './DialogWrapper';
export const DialogTrigger = ({ children }) => {
    const { onClickTrigger } = useContext(DialogContext);
    return (React.createElement(Wrapper, { onClick: onClickTrigger, "aria-haspopup": "dialog" }, children));
};
const Wrapper = styled.div `
  display: inline-block;
`;
//# sourceMappingURL=DialogTrigger.js.map