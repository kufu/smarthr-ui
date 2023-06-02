import React from 'react';
import styled from 'styled-components';
export const ButtonInner = ({ prefix, suffix, children }) => {
    return (React.createElement(React.Fragment, null,
        prefix,
        React.createElement(TextLabel, null, children),
        suffix));
};
const TextLabel = styled.span `
  /* LineClamp を併用する場合に、幅を計算してもらうために指定 */
  min-width: 0;

  .s & {
    /* FIXME! SVG とテキストコンテンツの縦位置が揃わないので暫定対応 */
    line-height: 0;
  }
`;
//# sourceMappingURL=ButtonInner.js.map