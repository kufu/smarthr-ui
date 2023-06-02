import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
/**
 * @param [size] フォントサイズの抽象値（font-size）
 * @param [weight] フォントウェイト（font-weight）
 * @param [italic] 斜体にするかどうかの真偽値（font-style: italic）
 * @param [color] 色。初期値は inherit（color、）
 * @param [leading] 行送りの抽象値（line-height）
 * @param [whiteSpace] ホワイトスペース（white-space）
 * @param [emphasis] 強調するかどうかの真偽値。指定すると em 要素になる
 * @param [as] テキストコンポーネントの HTML タグ名。初期値は span
 * @param [children]
 */
export const Text = ({ color, as = 'span', ...props }) => {
    return React.createElement(Wrapper, { ...props, "$color": color, as: props.emphasis ? 'em' : as });
};
const Wrapper = styled.span(({ size = 'M', weight = 'normal', italic, $color = 'inherit', leading = 'NORMAL', whiteSpace, emphasis, }) => {
    const { color: shrColor, fontSize, leading: shrLeading } = useTheme();
    return css `
      ${whiteSpace && `white-space: ${whiteSpace};`}
      font-size: ${fontSize[size]};
      line-height: ${shrLeading[leading]};
      font-weight: ${emphasis ? 'bold' : weight};
      ${italic && `font-style: italic;`}
      color: ${$color === 'inherit' ? $color : shrColor[$color]};
    `;
});
//# sourceMappingURL=Text.js.map