import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { isTouchDevice } from '../../libs/ua';
import { TableGroupContext } from './Table';
import { useClassNames } from './useClassNames';
/**
 * @deprecated Cell コンポーネントは非推奨です。代わりに Th または Td コンポーネントを使用してください。
 */
export const Cell = ({ className = '', children, onClick, colSpan, rowSpan, highlighted = false, nullable = false, ...elementProps }) => {
    const theme = useTheme();
    const { group } = useContext(TableGroupContext);
    const classNames = useClassNames().cell;
    const wrapperClass = [
        className,
        highlighted && 'highlighted',
        nullable && 'nullable',
        classNames.wrapper,
    ]
        .filter((c) => !!c)
        .join(' ');
    const props = {
        children,
        onClick,
        colSpan,
        rowSpan,
        className: wrapperClass,
        themes: theme,
        ...elementProps,
    };
    if (group === 'head') {
        return React.createElement(Th, { ...props });
    }
    else if (group === 'body') {
        return React.createElement(Td, { ...props });
    }
    else {
        return null;
    }
};
const Th = styled.th `
  ${({ themes, onClick }) => {
    const { fontSize, leading, spacingByChar, color, interaction } = themes;
    return css `
      height: calc(1em * ${leading.NORMAL} + ${spacingByChar(0.5)} * 2);
      font-size: ${fontSize.S};
      font-weight: bold;
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      color: ${color.TEXT_BLACK};
      transition: ${isTouchDevice ? 'none' : `background-color ${interaction.hover.animation}`};
      text-align: left;
      line-height: 1.5;
      vertical-align: middle;
      box-sizing: border-box;

      &.highlighted {
        background-color: ${color.hoverColor(color.HEAD)};
      }

      ${onClick &&
        css `
        :hover {
          background-color: ${color.hoverColor(color.HEAD)};
          cursor: pointer;
        }
      `}
    `;
}}
`;
const Td = styled.td `
  &.nullable {
    &:empty {
      &::after {
        content: '-----';
      }
    }
  }

  ${({ themes }) => {
    const { fontSize, leading, spacingByChar, color, border } = themes;
    return css `
      color: ${color.TEXT_BLACK};
      height: calc(1em * ${leading.RELAXED} + ${spacingByChar(0.5)} * 2);
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      border-top: ${border.shorthand};
      font-size: ${fontSize.M};
      line-height: 1.5;
      vertical-align: middle;
      box-sizing: border-box;
    `;
}};
`;
//# sourceMappingURL=Cell.js.map