import React from 'react';
import styled from 'styled-components';
import { useClassNames } from './useClassNames';
export const DropdownScrollArea = ({ children, className = '', ...props }) => {
    const classNames = useClassNames();
    return (React.createElement(Wrapper, { ...props, className: `${className} ${classNames.scrollArea}` }, children));
};
const Wrapper = styled.div `
  overflow-y: auto;
  flex: 1 1 auto;
`;
//# sourceMappingURL=DropdownScrollArea.js.map