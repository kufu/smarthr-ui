export const drawerSize = {
  S: 'shr-w-col4',
  M: 'shr-w-col6',
  L: 'shr-w-col8',
  FULL: 'shr-w-full',
} as const

export type DrawerSize = keyof typeof drawerSize
