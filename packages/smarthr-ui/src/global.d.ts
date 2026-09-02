/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare global {
  interface AriaNotifyOptions {
    priority: 'normal' | 'high'
  }

  interface Document {
    ariaNotify(announcement: string, options?: AriaNotifyOptions): void
  }
}

export {}
