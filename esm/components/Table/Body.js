import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { TableGroupContext } from './Table';
import { useClassNames } from './useClassNames';
/**
 * @deprecated Body コンポーネントは非推奨です。tbody 要素に置き換えてください。
 */
export const Body = ({ className = '', children, ...props }) => {
    const classNames = useClassNames().body;
    const theme = useTheme();
    return (React.createElement(Wrapper, { ...props, themes: theme, className: `${className} ${classNames.wrapper}` },
        React.createElement(TableGroupContext.Provider, { value: { group: 'body' } }, children)));
};
const Wrapper = styled.tbody `
  background-color: ${({ themes }) => themes.color.WHITE};
`;
//# sourceMappingURL=Body.js.map