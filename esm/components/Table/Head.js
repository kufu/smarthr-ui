import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { TableGroupContext } from './Table';
import { useClassNames } from './useClassNames';
/**
 * @deprecated Head コンポーネントは非推奨です。thead 要素に置き換えてください。
 * thead 部分を固定表示する場合は Table コンポーネントの fixedHead Props を指定してください。
 * bulkActionArea を使う場合は BulkActionRow コンポーネントを使用してください。
 */
export const Head = ({ bulkActionArea, className = '', fixed = false, children, ...props }) => {
    const themes = useTheme();
    const classNames = useClassNames().head;
    return (React.createElement(StyledThead, { ...props, className: className, themes: themes, "$fixed": fixed },
        React.createElement(TableGroupContext.Provider, { value: { group: 'head' } }, children),
        bulkActionArea && (React.createElement("tr", { className: classNames.bulkActionArea },
            React.createElement(BulkActionTD, { colSpan: 1000, themes: themes }, bulkActionArea)))));
};
const StyledThead = styled.thead(({ themes, $fixed }) => {
    const { zIndex } = themes;
    return ($fixed &&
        css `
      position: sticky;
      top: 0;
      left: 0;
      z-index: ${zIndex.FIXED_MENU}; /* zIndexの値はセマンティックトークンとして管理しているため、明示的に値を指定しないと重なり順が崩れるため設定しています */
    `);
});
const BulkActionTD = styled.td(({ themes }) => {
    const { fontSize, border, color, spacingByChar } = themes;
    return css `
    border-top: ${border.shorthand};
    background-color: ${color.ACTION_BACKGROUND};
    padding: ${spacingByChar(1)};
    font-size: ${fontSize.M};
  `;
});
//# sourceMappingURL=Head.js.map