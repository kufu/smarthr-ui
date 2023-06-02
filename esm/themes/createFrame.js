import { merge } from '../libs/lodash';
import { defaultPalette } from './createPalette';
const lineWidth = '1px';
const lineStyle = 'solid';
const lineColor = defaultPalette.BORDER;
/**
 * @deprecated The defaultFrame will be deprecated, please use defaultBorder or defaultRadius instead
 */
export const defaultFrame = {
    border: {
        lineWidth,
        lineStyle,
        default: `${lineWidth} ${lineStyle} ${lineColor}`,
        radius: {
            s: '4px',
            m: '6px',
        },
    },
};
export const createFrame = (userFrame = {}, userPalette = {}) => {
    const color = userPalette.BORDER || defaultPalette.BORDER;
    const created = merge({
        border: {
            ...defaultFrame.border,
            default: `${lineWidth} ${lineStyle} ${color}`,
            radius: { ...defaultFrame.border.radius },
        },
    }, userFrame);
    return created;
};
//# sourceMappingURL=createFrame.js.map