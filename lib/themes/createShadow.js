"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShadow = exports.defaultShadow = void 0;
const styled_components_1 = require("styled-components");
const lodash_1 = require("../libs/lodash");
const createColor_1 = require("./createColor");
const createOutline = (color) => `0 0 0 2px white, 0 0 0 4px ${color}`;
const defaultOutline = createOutline(createColor_1.defaultColor.OUTLINE);
const defaultOutlineMargin = '4px';
exports.defaultShadow = {
    BASE: `${createColor_1.defaultColor.TRANSPARENCY_15} 0 0 4px 0`,
    DIALOG: `${createColor_1.defaultColor.TRANSPARENCY_30} 0 4px 10px 0`,
    LAYER0: 'none',
    LAYER1: `0 1px 2px 0 ${createColor_1.defaultColor.TRANSPARENCY_30}`,
    LAYER2: `0 2px 4px 1px ${createColor_1.defaultColor.TRANSPARENCY_30}`,
    LAYER3: `0 4px 8px 2px ${createColor_1.defaultColor.TRANSPARENCY_30}`,
    LAYER4: `0 8px 16px 4px ${createColor_1.defaultColor.TRANSPARENCY_30}`,
    OUTLINE: defaultOutline,
    OUTLINE_MARGIN: defaultOutlineMargin,
};
const createFocusIndicatorStyles = (outline) => (0, styled_components_1.css) `
  outline: none;
  isolation: isolate;
  box-shadow: ${outline};
`;
const createShadow = (userShadow = {}, userColor = {}) => {
    const outline = createOutline(userColor.OUTLINE || createColor_1.defaultColor.OUTLINE);
    const created = (0, lodash_1.merge)({
        ...exports.defaultShadow,
        OUTLINE: outline,
        focusIndicatorStyles: createFocusIndicatorStyles(outline),
    }, userShadow);
    return created;
};
exports.createShadow = createShadow;
//# sourceMappingURL=createShadow.js.map