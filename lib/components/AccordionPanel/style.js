"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PREFIX = exports.Style = void 0;
const react_1 = __importDefault(require("react"));
const _1 = require(".");
const Style = () => (react_1.default.createElement(_1.AccordionPanel, null,
    react_1.default.createElement(_1.AccordionPanelItem, { name: "item1" },
        react_1.default.createElement(_1.AccordionPanelTrigger, null, "Trigger"),
        react_1.default.createElement(_1.AccordionPanelContent, null, "Content"))));
exports.Style = Style;
exports.PREFIX = 'AccordionPanel';
//# sourceMappingURL=style.js.map