import React from 'react';
import { IconBase } from 'react-icons';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { generateIcon } from './generateIcon';
const Wrapper = styled(IconBase)(() => {
    const { color } = useTheme();
    return css `
    .base {
      fill: ${color.WARNING_YELLOW};
      stroke: ${color.TEXT_BLACK};
      stroke-width: 1;
    }
    .mark {
      fill: ${color.TEXT_BLACK};
    }
  `;
});
export const WarningIcon = /*#__PURE__*/ generateIcon((props) => (React.createElement(Wrapper, { ...props, viewBox: "0 0 14 13" },
    React.createElement("path", { d: "M13.536 10.308v-.002L8.145.944C7.65.088 6.354.05 5.85.944l-.001.001-5.387 9.36c-.503.867.141 1.969 1.16 1.969h10.753a1.318 1.318 0 0 0 1.161-1.967Z", className: "base" }),
    React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7.82 7.827c-.019.128-.097.212-.199.238a.285.285 0 0 1-.07.009h-1.1a.286.286 0 0 1-.064-.007c-.105-.024-.187-.108-.206-.24l-.157-3.054c-.023-.157.112-.292.27-.292h1.413c.158 0 .292.135.27.292L7.82 7.827Zm-.306.785a1.03 1.03 0 0 0-1.535.899c0 .583.449 1.032 1.032 1.032a1.03 1.03 0 0 0 .503-1.931Z", className: "mark" }))));
//# sourceMappingURL=WarningIcon.js.map