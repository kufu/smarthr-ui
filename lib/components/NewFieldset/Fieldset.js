"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fieldset = void 0;
const react_1 = __importDefault(require("react"));
const FormGroup_1 = require("../FormGroup");
const Fieldset = (props) => {
    return react_1.default.createElement(FormGroup_1.FormGroup, { ...props, as: "fieldset" });
};
exports.Fieldset = Fieldset;
//# sourceMappingURL=Fieldset.js.map