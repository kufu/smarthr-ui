"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPortalPosition = exports.parseJpnDateString = void 0;
const wareki_1 = require("@smarthr/wareki");
const dayjs_1 = __importDefault(require("dayjs"));
function parseJpnDateString(dateString) {
    const { isValid, result, formatted } = (0, wareki_1.warekiToDate)(dateString);
    return isValid ? result : (0, dayjs_1.default)(formatted).toDate();
}
exports.parseJpnDateString = parseJpnDateString;
function getPortalPosition(inputRect, contentHeihgt) {
    const margin = 4;
    const { innerHeight, pageYOffset } = window;
    const left = pageXOffset + inputRect.left;
    const hasNoSpaceOnBottomSide = inputRect.bottom + contentHeihgt > innerHeight;
    const isTopSideSpaceBiggerThanBottomSide = inputRect.top > innerHeight - inputRect.bottom;
    if (hasNoSpaceOnBottomSide && isTopSideSpaceBiggerThanBottomSide) {
        // display on top side
        return {
            top: pageYOffset + inputRect.top - contentHeihgt + margin,
            left,
        };
    }
    // display on bottom side
    return {
        top: pageYOffset + inputRect.bottom - margin,
        left,
    };
}
exports.getPortalPosition = getPortalPosition;
//# sourceMappingURL=datePickerHelper.js.map