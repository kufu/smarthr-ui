'use client'

import { type FC, memo, useEffect, useState } from 'react'
import { VisuallyHiddenText } from 'smarthr-ui'

import { useLatest } from '../../../../hooks/useLatest'
import { type UseIntlReturn, useIntl } from '../../../../intl'
import { BLOCK_CATALOG, describeSubject } from '../blockCatalog'

import { BLOCK_ANNOUNCEMENT_META, type BlockAnnouncement } from './BlockActions'
import { lastBoundary } from './blockRange'

import type { Transaction } from '@tiptap/pm/state'
import type { Editor } from '@tiptap/react'

// 空にした直後に書き戻すと、支援技術が変化を拾わず、同じ文が続いたときに読まれないことがある
const REANNOUNCE_DELAY = 100

const MOVE_LIMIT_LABELS = {
  first: { id: 'smarthr-ui/RichTextEditor/blockMoveLimitFirst', defaultText: '先頭のブロックです' },
  last: { id: 'smarthr-ui/RichTextEditor/blockMoveLimitLast', defaultText: '最後のブロックです' },
} as const

type Notice = { announcement: BlockAnnouncement; total: number }

const toSentence = ({ announcement, total }: Notice, localize: UseIntlReturn['localize']) => {
  switch (announcement.type) {
    case 'moved':
      return localize(
        {
          id: 'smarthr-ui/RichTextEditor/blockMoved',
          defaultText: '{block}を{total}個中{position}番目に移動しました',
        },
        {
          block: describeSubject(announcement, localize),
          total,
          position: announcement.position,
        },
      )
    case 'duplicated':
      return localize(
        { id: 'smarthr-ui/RichTextEditor/blockDuplicated', defaultText: '{block}を複製しました' },
        { block: describeSubject(announcement, localize) },
      )
    case 'deleted':
      return localize(
        { id: 'smarthr-ui/RichTextEditor/blockDeleted', defaultText: '{block}を削除しました' },
        { block: describeSubject(announcement, localize) },
      )
    case 'converted':
      return localize(
        {
          id: 'smarthr-ui/RichTextEditor/blockConverted',
          defaultText: '{block}を{kind}に変換しました',
        },
        {
          block: describeSubject(announcement, localize),
          // name ではなく label にするのは、メニューで選んだ項目と同じ名前で確かめられるようにするため
          kind: localize(BLOCK_CATALOG.find(({ id }) => id === announcement.to)!.label),
        },
      )
    case 'moveLimit':
      return localize(MOVE_LIMIT_LABELS[announcement.edge])
  }
}

type Props = { editor: Editor }

/**
 * 本文の aria-activedescendant には触れない。VoiceOver はその変化で本文のラベルから読み直し、
 * 同時に出した知らせが埋もれる
 */
export const BlockAnnouncer: FC<Props> = memo(({ editor }) => {
  const { localize } = useIntl()
  const [notice, setNotice] = useState<Notice | null>(null)

  const latest = useLatest({ editor })

  useEffect(() => {
    const { editor: currentEditor } = latest
    let timer: ReturnType<typeof setTimeout> | undefined

    const handleTransaction = ({ transaction }: { transaction: Transaction }) => {
      const announcement = transaction.getMeta(BLOCK_ANNOUNCEMENT_META) as
        BlockAnnouncement | undefined

      if (!announcement) return

      // 末尾の空の段落より下へは動かせない。数に入れると「4個中3番目」の次に「最後のブロックです」と読まれる
      const total =
        announcement.type === 'moved'
          ? lastBoundary(latest.editor.state.doc, announcement.position - 1 + announcement.count)
          : latest.editor.state.doc.childCount
      const next = { announcement, total }

      clearTimeout(timer)
      setNotice(null)
      timer = setTimeout(() => setNotice(next), REANNOUNCE_DELAY)
    }

    currentEditor.on('transaction', handleTransaction)

    return () => {
      clearTimeout(timer)
      currentEditor.off('transaction', handleTransaction)
    }
  }, [latest])

  return (
    <VisuallyHiddenText as="div" role="status">
      {notice ? toSentence(notice, localize) : ''}
    </VisuallyHiddenText>
  )
})
