import { merge } from '../libs/lodash';
import { defaultColor } from './createColor';
const defaultLineWidth = '1px';
const defaultLineStyle = 'solid';
const defaultLineColor = defaultColor.BORDER;
const highContrastBorderColor = defaultColor.GREY_100;
export const defaultBorder = {
    lineWidth: defaultLineWidth,
    lineStyle: defaultLineStyle,
    shorthand: `${defaultLineWidth} ${defaultLineStyle} ${defaultLineColor}`,
    highContrast: `${defaultLineWidth} ${defaultLineStyle} ${highContrastBorderColor}`,
};
export const createBorder = (userBorder = {}, userColor = {}) => {
    const color = userColor.BORDER || defaultColor.BORDER;
    const created = merge({
        ...defaultBorder,
        shorthand: `${defaultLineWidth} ${defaultLineStyle} ${color}`,
    }, userBorder);
    return created;
};
//# sourceMappingURL=createBorder.js.map