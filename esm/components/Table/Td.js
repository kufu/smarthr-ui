import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { useTdClassNames } from './useClassNames';
import { useReelShadow } from './useReelShadow';
export const Td = ({ nullable = false, fixed = false, className = '', ...props }) => {
    const theme = useTheme();
    const classNames = useTdClassNames();
    const wrapperClass = [className, nullable && 'nullable', classNames.wrapper]
        .filter((c) => !!c)
        .join(' ');
    return (React.createElement(StyledTd, { ...props, className: `${wrapperClass} ${fixed ? 'fixedElement' : ''}`, themes: theme, fixed: fixed }));
};
const StyledTd = styled.td `
  &.nullable {
    &:empty {
      &::after {
        content: '-----';
      }
    }
  }

  ${({ themes, fixed }) => {
    const { fontSize, leading, spacingByChar, color, border } = themes;
    return css `
      color: ${color.TEXT_BLACK};
      height: calc(1em * ${leading.NORMAL});
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      border-top: ${border.shorthand};
      font-size: ${fontSize.M};
      line-height: ${leading.NORMAL};
      vertical-align: middle;
      position: relative;

      /* これ以降の記述はTableReel内で'fixed'を利用した際に追従させるために必要 */
      &.fixedElement {
        ${useReelShadow({ showShadow: false, direction: 'right' })}
      }

      ${fixed &&
        css `
        &.fixed {
          position: sticky;
          right: 0;
          background-color: ${color.WHITE};

          &::after {
            opacity: 1;
          }
        }
      `}
    `;
}};
`;
//# sourceMappingURL=Td.js.map