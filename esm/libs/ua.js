var ua = window.navigator.userAgent.toLowerCase();
export var isIe = ua.indexOf('msie') !== -1 || ua.indexOf('trident') !== -1;
export var isSp = (ua.indexOf('windows') !== -1 && ua.indexOf('phone') !== -1) ||
    (ua.indexOf('android') !== -1 && ua.indexOf('mobile') !== -1) ||
    (ua.indexOf('firefox') !== -1 && ua.indexOf('mobile') !== -1) ||
    ua.indexOf('iphone') !== -1 ||
    ua.indexOf('ipod') !== -1 ||
    ua.indexOf('blackberry') !== -1;
export var isTablet = (ua.indexOf('windows') !== -1 && ua.indexOf('touch') !== -1 && ua.indexOf('tablet pc') === -1) ||
    (ua.indexOf('android') !== -1 && ua.indexOf('mobile') === -1) ||
    (ua.indexOf('firefox') !== -1 && ua.indexOf('tablet') !== -1) ||
    ua.indexOf('ipad') !== -1 ||
    ua.indexOf('kindle') !== -1 ||
    ua.indexOf('silk') !== -1 ||
    ua.indexOf('playbook') !== -1;
export var isPc = !isSp && !isTablet;
export var isTouchDevice = isSp || isTablet;
export var isMouseDevice = isPc;
//# sourceMappingURL=ua.js.map