import { css } from 'styled-components';
import { merge } from '../libs/lodash';
import { defaultColor } from './createColor';
const createOutline = (color) => `0 0 0 2px white, 0 0 0 4px ${color}`;
const defaultOutline = createOutline(defaultColor.OUTLINE);
const defaultOutlineMargin = '4px';
export const defaultShadow = {
    BASE: `${defaultColor.TRANSPARENCY_15} 0 0 4px 0`,
    DIALOG: `${defaultColor.TRANSPARENCY_30} 0 4px 10px 0`,
    LAYER0: 'none',
    LAYER1: `0 1px 2px 0 ${defaultColor.TRANSPARENCY_30}`,
    LAYER2: `0 2px 4px 1px ${defaultColor.TRANSPARENCY_30}`,
    LAYER3: `0 4px 8px 2px ${defaultColor.TRANSPARENCY_30}`,
    LAYER4: `0 8px 16px 4px ${defaultColor.TRANSPARENCY_30}`,
    OUTLINE: defaultOutline,
    OUTLINE_MARGIN: defaultOutlineMargin,
};
const createFocusIndicatorStyles = (outline) => css `
  outline: none;
  isolation: isolate;
  box-shadow: ${outline};
`;
export const createShadow = (userShadow = {}, userColor = {}) => {
    const outline = createOutline(userColor.OUTLINE || defaultColor.OUTLINE);
    const created = merge({
        ...defaultShadow,
        OUTLINE: outline,
        focusIndicatorStyles: createFocusIndicatorStyles(outline),
    }, userShadow);
    return created;
};
//# sourceMappingURL=createShadow.js.map