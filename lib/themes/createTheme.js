"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTheme = void 0;
var createFrame_1 = require("./createFrame");
var createInteraction_1 = require("./createInteraction");
var createPalette_1 = require("./createPalette");
var createSize_1 = require("./createSize");
exports.createTheme = function (theme) {
    if (theme === void 0) { theme = {}; }
    var created = {
        palette: createPalette_1.createPalette(theme.palette || {}),
        size: createSize_1.createSize(theme.size || {}),
        frame: createFrame_1.createFrame(theme.frame || {}, theme.palette || {}),
        interaction: createInteraction_1.createInteraction(theme.interaction || {}),
    };
    return created;
};
//# sourceMappingURL=createTheme.js.map