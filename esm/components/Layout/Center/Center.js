import styled, { css } from 'styled-components';
import { useSpacing } from '../../../hooks/useSpacing';
export const Center = styled.div(({ minHeight, maxWidth, padding, verticalCentering = false }) => {
    return css `
    box-sizing: content-box;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    ${minHeight && `min-height: ${minHeight};`}
    ${maxWidth && `max-width: ${maxWidth};`}
    ${padding && `padding: ${useSpacing(padding)};`}
    ${verticalCentering && 'justify-content: center;'}
  `;
});
//# sourceMappingURL=Center.js.map