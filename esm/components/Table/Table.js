import React, { createContext } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { useClassNames } from './useClassNames';
export const TableGroupContext = createContext({
    group: 'body',
});
export const Table = ({ fixedHead = false, children, className = '', ...props }) => {
    const theme = useTheme();
    const classNames = useClassNames().table;
    return (React.createElement(Wrapper, { ...props, fixedHead: fixedHead, themes: theme, className: `${className} ${classNames.wrapper}` }, children));
};
const Wrapper = styled.table `
  ${({ fixedHead, themes }) => {
    const { border, color, zIndex } = themes;
    return css `
      width: 100%;
      border-collapse: separate; /* Headがfixed=trueの場合、separate以外だとHeadとBodyの間に隙間が生まれるため、明示的に指定しています */
      border-spacing: 0;
      background-color: ${color.COLUMN};

      thead {
        ${fixedHead &&
        css `
          position: sticky;
          top: 0;
          left: 0;
          z-index: ${zIndex.FIXED_MENU}; /* zIndexの値はセマンティックトークンとして管理しているため、明示的に値を指定しないと重なり順が崩れるため設定しています */
        `}
      }

      tbody {
        background-color: ${color.WHITE};
      }

      th {
        background-color: ${color.HEAD};
      }

      @media (prefers-contrast: more) {
        &,
        & th,
        & td {
          border: ${border.highContrast};
        }
      }
    `;
}}
`;
//# sourceMappingURL=Table.js.map