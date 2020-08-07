import { createFrame } from './createFrame';
import { createInteraction, } from './createInteraction';
import { createPalette } from './createPalette';
import { createSize } from './createSize';
export var createTheme = function (theme) {
    if (theme === void 0) { theme = {}; }
    var created = {
        palette: createPalette(theme.palette || {}),
        size: createSize(theme.size || {}),
        frame: createFrame(theme.frame || {}, theme.palette || {}),
        interaction: createInteraction(theme.interaction || {}),
    };
    return created;
};
//# sourceMappingURL=createTheme.js.map