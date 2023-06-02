import React, { useEffect, useState } from 'react';
import { createGlobalStyle, css } from 'styled-components';
export const BodyScrollSuppressor = () => {
    const [scrollBarWidth, setScrollBarWidth] = useState(null);
    const [paddingRight, setPaddingRight] = useState(null);
    useEffect(() => {
        setScrollBarWidth(window.innerWidth - document.body.clientWidth);
    }, []);
    useEffect(() => {
        if (scrollBarWidth === null) {
            return;
        }
        const originalPaddingRight = getComputedStyle(document.body).getPropertyValue('padding-right');
        setPaddingRight(scrollBarWidth + parseInt(originalPaddingRight, 10));
    }, [scrollBarWidth]);
    if (scrollBarWidth === null) {
        return null;
    }
    return React.createElement(ScrollSuppressing, { paddingRight: paddingRight });
};
const ScrollSuppressing = createGlobalStyle `
  body {
    overflow: hidden;
    ${({ paddingRight }) => paddingRight &&
    css `
        padding-right: ${paddingRight}px !important;
      `}
  }
`;
//# sourceMappingURL=BodyScrollSuppressor.js.map