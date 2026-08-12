'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { tv } from 'tailwind-variants'

import { Stack } from '../Layout'
import { TextLink } from '../TextLink'

const classNameGenerator = tv({
  base: [
    'shr-block',
    'shr-px-1 shr-py-0.5',
    'shr-rounded',
    'shr-text-black',
    'shr-no-underline',
    '!shr-shadow-none',
    'shr-leading-[0px]',
    'hover:shr-font-bold',
    `before:shr-border-l-shorthand before:shr-border-l-[4px] before:shr-border-transparent before:shr-pl-0.5 before:shr-content-['']`,
  ],
})

type IndexNavItem = {
  id: string
  label: ReactNode
}

type Props = {
  items: IndexNavItem[]
}

export const IndexNav = ({ items }: Props) => {
  const actualClassName = useMemo(() => classNameGenerator(), [])
  const [activeId, setActiveId] = useState<string | null>(null)
  const { formatMessage } = useIntl()

  useEffect(() => {
    const handleScroll = () => {
      // 各セクションの位置を確認して、現在表示されているセクションを特定
      const scrollPosition = window.scrollY + 100 // ヘッダー分のオフセット

      for (const item of items) {
        const element = document.getElementById(item.id)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveId(item.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初期状態を設定

    return () => window.removeEventListener('scroll', handleScroll)
  }, [items])

  return (
    <Stack
      as="nav"
      className="shr-sticky shr-top-4"
      aria-label={formatMessage({
        id: 'requests/new/IndexNav/navLabel',
        defaultMessage: 'ページ内リンク',
      })}
    >
      {items.map((item) => (
        <TextLink
          key={item.id}
          href={`#${item.id}`}
          // TODO: shr-border で対応している active時の表示を before 擬似要素を使って調整する
          className={`${actualClassName} ${activeId === item.id ? 'shr-font-bold before:shr-border-link' : ''}`}
        >
          {item.label}
        </TextLink>
      ))}
    </Stack>
  )
}
