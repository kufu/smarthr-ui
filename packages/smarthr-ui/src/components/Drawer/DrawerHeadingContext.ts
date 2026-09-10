'use client'

import { createContext } from 'react'

// DrawerContentInner が生成した見出し id を DrawerHeader に渡すための Context。
// DrawerHeader はこの id を見出しテキスト要素に適用し、
// DrawerContentInner は（ariaLabel/ariaLabelledby 未指定時に）これを aria-labelledby に使う。
export const DrawerHeadingContext = createContext<{ headingId: string }>({ headingId: '' })
