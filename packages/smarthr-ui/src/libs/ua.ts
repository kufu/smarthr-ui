const ua = typeof window !== 'undefined' ? window.navigator.userAgent.toLowerCase() : 'SSR'

const isWindows = ua.indexOf('windows') !== -1
const isAndroid = ua.indexOf('android') !== -1
const isMobile = ua.indexOf('mobile') !== -1
const isFirefox = ua.indexOf('firefox') !== -1
const isIphone = ua.indexOf('iphone') !== -1
const isIpod = ua.indexOf('ipod') !== -1
const isIpad = ua.indexOf('ipad') !== -1

export const isIe = ua.indexOf('msie') !== -1 || ua.indexOf('trident') !== -1

export const isSp =
  (isWindows && ua.indexOf('phone') !== -1) ||
  (isAndroid && isMobile) ||
  (isFirefox && isMobile) ||
  isIphone ||
  isIpod ||
  ua.indexOf('blackberry') !== -1

export const isTablet =
  (isWindows && ua.indexOf('touch') !== -1 && ua.indexOf('tablet pc') === -1) ||
  (isAndroid && !isMobile) ||
  (isFirefox && ua.indexOf('tablet') !== -1) ||
  isIpad ||
  ua.indexOf('kindle') !== -1 ||
  ua.indexOf('silk') !== -1 ||
  ua.indexOf('playbook') !== -1

export const isPc = !isSp && !isTablet

export const isTouchDevice = isSp || isTablet
export const isMouseDevice = isPc
export const isMobileSafari =
  (isIphone || isIpod) && ua.indexOf('safari') !== -1 && ua.indexOf('apple') !== -1

export const isIOS = isIphone || isIpad || isIpod
