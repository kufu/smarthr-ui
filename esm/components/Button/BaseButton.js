import React from 'react';
import styled, { css } from 'styled-components';
import { hoverable } from '../../hocs/hoverable';
import { useTheme } from '../../hooks/useTheme';
export const buttonFactory = (tag) => {
    const BaseTag = hoverable()(tagStore[tag]);
    const Button = ({ size = 'default', className = '', square = false, children = '', prefix = '', suffix = '', ...props }) => {
        const theme = useTheme();
        // prettier-ignore
        const classNames = `${size} ${className} ${square ? 'square' : ''} ${prefix ? 'prefix' : ''} ${suffix ? 'suffix' : ''}`;
        return (React.createElement(BaseTag, { ...props, className: classNames, themes: theme },
            prefix,
            React.createElement(TextLabel, null, children),
            suffix));
    };
    return Button;
};
const Base = styled.div `
  ${({ themes, wide }) => {
    const { border, fontSize, leading, radius, shadow, spacingByChar } = themes;
    return css `
      box-sizing: border-box;
      cursor: pointer;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: ${spacingByChar(0.5)};
      text-align: center;
      white-space: nowrap;
      border-radius: ${radius.m};

      /* ボタンの高さを合わせるために指定 */
      border: ${border.lineWidth} ${border.lineStyle} transparent;
      padding: ${spacingByChar(0.75)} ${spacingByChar(1)};
      font-family: inherit;
      font-size: ${fontSize.M};
      font-weight: bold;
      line-height: ${leading.NONE};
      ${wide && 'width: 100%;'}

      &.square {
        padding: ${spacingByChar(0.75)};
      }

      &.s {
        padding: ${spacingByChar(0.5)};
        font-size: ${fontSize.S};

        /* ボタンラベルの line-height を 0 にしたため、高さを担保する */
        min-height: calc(${fontSize.S} + ${spacingByChar(1)} + (${border.lineWidth} * 2));
      }

      &[disabled] {
        cursor: not-allowed;

        /* alpha color を使用しているので、背景色と干渉させない */
        background-clip: padding-box;
      }

      &:focus-visible {
        ${shadow.focusIndicatorStyles}
      }

      /* baseline より下の leading などの余白を埋める */
      .smarthr-ui-Icon,
      svg {
        display: block;
      }
    `;
}}
`;
const TextLabel = styled.span `
  /* LineClamp を併用する場合に、幅を計算してもらうために指定 */
  min-width: 0;

  .s & {
    /* FIXME! SVG とテキストコンテンツの縦位置が揃わないので暫定対応 */
    line-height: 0;
  }
`;
const tagStore = {
    button: Base.withComponent('button'),
    a: Base.withComponent('a'),
};
export const BaseButton = buttonFactory('button');
const ButtonAnchor = buttonFactory('a');
export const BaseButtonAnchor = styled(ButtonAnchor) `
  text-decoration: none;

  &:not([href]) {
    cursor: not-allowed;

    /* alpha color を使用しているので、背景色と干渉させない */
    background-clip: padding-box;
  }
`;
//# sourceMappingURL=BaseButton.js.map