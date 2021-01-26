const ua =
  typeof window.navigator !== 'undefined' ? window.navigator.userAgent.toLowerCase() : 'SSR'

export const isIe = ua.indexOf('msie') !== -1 || ua.indexOf('trident') !== -1

export const isSp =
  (ua.indexOf('windows') !== -1 && ua.indexOf('phone') !== -1) ||
  (ua.indexOf('android') !== -1 && ua.indexOf('mobile') !== -1) ||
  (ua.indexOf('firefox') !== -1 && ua.indexOf('mobile') !== -1) ||
  ua.indexOf('iphone') !== -1 ||
  ua.indexOf('ipod') !== -1 ||
  ua.indexOf('blackberry') !== -1

export const isTablet =
  (ua.indexOf('windows') !== -1 && ua.indexOf('touch') !== -1 && ua.indexOf('tablet pc') === -1) ||
  (ua.indexOf('android') !== -1 && ua.indexOf('mobile') === -1) ||
  (ua.indexOf('firefox') !== -1 && ua.indexOf('tablet') !== -1) ||
  ua.indexOf('ipad') !== -1 ||
  ua.indexOf('kindle') !== -1 ||
  ua.indexOf('silk') !== -1 ||
  ua.indexOf('playbook') !== -1

export const isPc = !isSp && !isTablet

export const isTouchDevice = isSp || isTablet
export const isMouseDevice = isPc
export const isMobileSafari =
  (ua.indexOf('iphone') !== -1 || ua.indexOf('ipod') !== -1) &&
  ua.indexOf('safari') !== -1 &&
  ua.indexOf('apple') !== -1
