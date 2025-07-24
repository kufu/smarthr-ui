const ua = typeof window !== 'undefined' ? window.navigator.userAgent.toLowerCase() : 'SSR'

const isIphone = ua.indexOf('iphone') !== -1
const isIpod = ua.indexOf('ipod') !== -1
const isIpad = ua.indexOf('ipad') !== -1

export const isMobileSafari =
  (isIphone || isIpod) && ua.indexOf('safari') !== -1 && ua.indexOf('apple') !== -1

export const isIOS = isIphone || isIpad || isIpod
