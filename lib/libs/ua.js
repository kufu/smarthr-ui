"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMouseDevice = exports.isTouchDevice = exports.isPc = exports.isTablet = exports.isSp = exports.isIe = void 0;
var ua = window.navigator.userAgent.toLowerCase();
exports.isIe = ua.indexOf('msie') !== -1 || ua.indexOf('trident') !== -1;
exports.isSp = (ua.indexOf('windows') !== -1 && ua.indexOf('phone') !== -1) ||
    (ua.indexOf('android') !== -1 && ua.indexOf('mobile') !== -1) ||
    (ua.indexOf('firefox') !== -1 && ua.indexOf('mobile') !== -1) ||
    ua.indexOf('iphone') !== -1 ||
    ua.indexOf('ipod') !== -1 ||
    ua.indexOf('blackberry') !== -1;
exports.isTablet = (ua.indexOf('windows') !== -1 && ua.indexOf('touch') !== -1 && ua.indexOf('tablet pc') === -1) ||
    (ua.indexOf('android') !== -1 && ua.indexOf('mobile') === -1) ||
    (ua.indexOf('firefox') !== -1 && ua.indexOf('tablet') !== -1) ||
    ua.indexOf('ipad') !== -1 ||
    ua.indexOf('kindle') !== -1 ||
    ua.indexOf('silk') !== -1 ||
    ua.indexOf('playbook') !== -1;
exports.isPc = !exports.isSp && !exports.isTablet;
exports.isTouchDevice = exports.isSp || exports.isTablet;
exports.isMouseDevice = exports.isPc;
//# sourceMappingURL=ua.js.map