// mobile ? Drawer : Dialog の書き分けで同じラベルが同じ幅になるよう dialogSize と同値にする。
// 定義を共有せず複製しているのは、Drawer 側の変更が Dialog に波及しないようにするため。
export const drawerSize = {
  S: 'shr-w-col4',
  M: 'shr-w-col5',
  L: 'shr-w-col6',
  FULL: 'shr-w-full',
} as const

export type DrawerSize = keyof typeof drawerSize

// FULL を許すとメインの幅が 0 になり、横に並べる意味が無くなる
export type InlineDrawerSize = Exclude<DrawerSize, 'FULL'>
