'use client'

import {
  type CSSProperties,
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  type MouseEvent,
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Button, FaMagnifyingGlassIcon, Input } from 'smarthr-ui'

import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { useLatest } from '../../../hooks/useLatest'
import { useIntl } from '../../../intl'
import { findDelegateTarget } from '../../../libs/delegate'
import { tv } from '../../../libs/tv'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { useToolbarDropdown } from '../hooks/useToolbarDropdown'
import { isSafeVideoSrc } from '../serializers/safeAttributes'

import { ToolbarButton } from './ToolbarButton'

import type { RovingButtonProps } from '../hooks/useRovingToolbar'
import type { RichTextVideo } from '../types'

const classNameGenerator = tv({
  slots: {
    picker:
      'shr-rte-flex shr-rte-min-h-0 shr-rte-w-[22rem] shr-rte-max-w-full shr-rte-flex-col shr-rte-gap-0.75 shr-rte-p-1',
    body: 'shr-rte-flex shr-rte-min-h-0 shr-rte-flex-col shr-rte-gap-0.5',
    status: 'shr-rte-m-0 shr-rte-py-0.5 shr-rte-text-sm shr-rte-text-grey empty:shr-rte-p-0',
    list: 'shr-rte-m-0 shr-rte-max-h-[18rem] shr-rte-list-none shr-rte-overflow-y-auto shr-rte-p-0',
    option: [
      'shr-rte-grid shr-rte-w-full shr-rte-cursor-pointer shr-rte-grid-cols-[auto_1fr] shr-rte-items-center shr-rte-gap-x-0.75',
      'shr-rte-rounded-m shr-rte-border-none shr-rte-bg-transparent shr-rte-p-0.5 shr-rte-text-left shr-rte-text-black',
      'focus-visible:shr-rte-focus-indicator hover:shr-rte-bg-white-darken',
    ],
    thumbnail: [
      'shr-rte-row-span-2 shr-rte-flex shr-rte-h-[3.375rem] shr-rte-w-[6rem] shr-rte-items-center shr-rte-justify-center',
      'shr-rte-rounded-s shr-rte-bg-white-darken shr-rte-bg-cover shr-rte-bg-center shr-rte-text-xl shr-rte-text-grey',
    ],
    title: 'shr-rte-self-end shr-rte-break-words shr-rte-text-sm',
    duration: 'shr-rte-self-start shr-rte-text-sm shr-rte-text-grey',
  },
})

const CLASS_NAMES = (() => {
  const { picker, body, status, list, option, thumbnail, title, duration } = classNameGenerator()

  return {
    picker: picker(),
    body: body(),
    status: status(),
    list: list(),
    option: option(),
    thumbnail: thumbnail(),
    title: title(),
    duration: duration(),
  }
})()

/** smarthr-ui に動画のアイコンが無いため、エディタ内に持つ */
const VideoIcon: FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    focusable="false"
    width="1em"
    height="1em"
    aria-hidden="true"
  >
    <rect x="1.5" y="5.5" rx="2.5" width="14" height="13" />
    <path d="M16.5 10.2 22.5 6.8v10.4l-6-3.4z" />
  </svg>
)

const TRIGGER_ICON = <VideoIcon />
const SEARCH_ICON = <FaMagnifyingGlassIcon />

const KATAKANA = /[ァ-ヶ]/g
const KATAKANA_TO_HIRAGANA = 0x60

const toSearchText = (text: string) =>
  text
    .normalize('NFKC')
    .toLowerCase()
    .replace(KATAKANA, (char) => String.fromCharCode(char.charCodeAt(0) - KATAKANA_TO_HIRAGANA))

const formatDuration = (seconds: number | undefined): string | null => {
  if (seconds === undefined || !Number.isFinite(seconds) || seconds < 0) return null

  const total = Math.floor(seconds)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = String(total % 60).padStart(2, '0')

  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`
}

const isListableVideo = (video: RichTextVideo) =>
  isSafeVideoSrc(video.src) && ((video.poster ?? null) === null || isSafeVideoSrc(video.poster))

type VideoEntry = {
  id: string
  video: RichTextVideo
  searchText: string
  duration: string | null
  posterStyle: CSSProperties | undefined
}

type LoadState =
  { status: 'loading' } | { status: 'error' } | { status: 'loaded'; entries: readonly VideoEntry[] }

const toEntries = (videos: readonly RichTextVideo[], idPrefix: string): VideoEntry[] => {
  const unlisted = videos.filter((video) => !isListableVideo(video))

  if (unlisted.length > 0) {
    console.warn(
      '[RichTextEditor] loadVideos が返した動画のうち、src か poster が http(s) の URL でもルート相対パスでもないものを一覧から除きました',
      unlisted,
    )
  }

  return videos.filter(isListableVideo).map((video, index) => ({
    id: `${idPrefix}-${index}`,
    video,
    searchText: toSearchText(video.title),
    duration: formatDuration(video.duration),
    posterStyle: video.poster
      ? { backgroundImage: `url(${JSON.stringify(video.poster)})` }
      : undefined,
  }))
}

type PickerProps = {
  label: string
  handleDismiss: () => void
  handleInserted: () => void
}

const VideoPicker: FC<PickerProps> = ({ label, handleDismiss, handleInserted }) => {
  const { editor, getVideoHandlers } = useRichTextEditorContext()
  const { localize } = useIntl()
  const idPrefix = useId()
  const [load, setLoad] = useState<LoadState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const [query, setQuery] = useState('')
  const latest = useLatest({ load, getVideoHandlers })

  useEffect(() => {
    const { loadVideos } = latest.getVideoHandlers()

    if (!loadVideos) return undefined

    const controller = new AbortController()
    const run = async () => {
      try {
        const videos = await loadVideos({ signal: controller.signal })

        if (!controller.signal.aborted) {
          setLoad({ status: 'loaded', entries: toEntries(videos, idPrefix) })
        }
      } catch {
        if (!controller.signal.aborted) setLoad({ status: 'error' })
      }
    }

    run()

    return () => controller.abort()
  }, [attempt, idPrefix, latest])

  const searchInputRef = useRef<HTMLInputElement>(null)
  const focusOnMountRef = useCallback((node: HTMLInputElement | null) => {
    if (!node) return undefined

    // 開いた直後は位置を測る間 visibility:hidden で、フォーカスを受け付けない
    const frame = requestAnimationFrame(() => node.focus())

    return () => cancelAnimationFrame(frame)
  }, [])
  const searchRef = useMergeRefs(searchInputRef, focusOnMountRef)
  const listRef = useRef<HTMLUListElement>(null)

  const functions = useMemo(
    () => ({
      handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value),
      handleRetry: () => {
        searchInputRef.current?.focus()
        setLoad({ status: 'loading' })
        setAttempt((prev) => prev + 1)
      },
      handleDelegateClick: (e: MouseEvent<HTMLUListElement>) => {
        const option = findDelegateTarget<HTMLButtonElement>(e, 'button[id]')
        const entry =
          option && latest.load.status === 'loaded'
            ? latest.load.entries.find(({ id }) => id === option.id)
            : undefined

        if (!entry) return

        const { src, title, poster } = entry.video

        editor
          .chain()
          .focus()
          .insertContent({ type: 'video', attrs: { src, title, poster: poster ?? null } })
          .run()
        handleInserted()
      },
      handleDelegateKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.nativeEvent.isComposing) return

        if (e.key === 'Escape') {
          e.preventDefault()
          e.stopPropagation()
          handleDismiss()

          return
        }

        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return

        const targets: Array<HTMLElement | null> = [
          searchInputRef.current,
          ...Array.from(listRef.current?.querySelectorAll('button') ?? []),
        ]
        const index = targets.indexOf(e.target as HTMLElement)
        const next = targets[index + (e.key === 'ArrowDown' ? 1 : -1)]

        if (index === -1 || !next) return

        e.preventDefault()
        next.focus()
      },
    }),
    [editor, handleDismiss, handleInserted, latest],
  )

  const loadingText = localize({
    id: 'smarthr-ui/RichTextEditor/videoLoading',
    defaultText: '読み込み中...',
  })
  const errorText = localize({
    id: 'smarthr-ui/RichTextEditor/videoLoadError',
    defaultText: '動画の一覧を読み込めませんでした。',
  })
  const emptyText = localize({
    id: 'smarthr-ui/RichTextEditor/videoEmpty',
    defaultText: '動画がありません。',
  })
  const noMatchText = localize({
    id: 'smarthr-ui/RichTextEditor/videoNoMatch',
    defaultText: '該当する動画がありません。',
  })

  const entries = load.status === 'loaded' ? load.entries : null
  const matched = useMemo(() => {
    const searchText = toSearchText(query).trim()

    return entries?.filter((entry) => entry.searchText.includes(searchText)) ?? []
  }, [entries, query])

  const statusText =
    load.status === 'loading'
      ? loadingText
      : load.status === 'error'
        ? errorText
        : load.entries.length === 0
          ? emptyText
          : matched.length === 0
            ? noMatchText
            : ''

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      role="dialog"
      className={CLASS_NAMES.picker}
      aria-label={label}
      onKeyDown={functions.handleDelegateKeyDown}
    >
      <Input
        ref={searchRef}
        type="search"
        name="videoSearch"
        value={query}
        width="100%"
        aria-label={localize({
          id: 'smarthr-ui/RichTextEditor/videoSearch',
          defaultText: '動画を検索',
        })}
        onChange={functions.handleSearchChange}
        prefix={SEARCH_ICON}
      />
      <div className={CLASS_NAMES.body}>
        <p role="status" className={CLASS_NAMES.status}>
          {statusText}
        </p>
        {load.status === 'error' && (
          <Button size="S" onClick={functions.handleRetry}>
            {localize({ id: 'smarthr-ui/RichTextEditor/videoReload', defaultText: '再読み込み' })}
          </Button>
        )}
        {matched.length > 0 && (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
          <ul ref={listRef} className={CLASS_NAMES.list} onClick={functions.handleDelegateClick}>
            {matched.map(({ id, video, duration, posterStyle }) => (
              <li key={id}>
                <button type="button" id={id} className={CLASS_NAMES.option}>
                  <span className={CLASS_NAMES.thumbnail} style={posterStyle}>
                    {!posterStyle && <VideoIcon />}
                  </span>
                  <span className={CLASS_NAMES.title}>{video.title}</span>
                  {duration && <span className={CLASS_NAMES.duration}>{duration}</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

type Props = RovingButtonProps & {
  disabled?: boolean
}

export const VideoInsertButton: FC<Props> = memo(
  ({ tabIndex = -1, disabled, onKeyDown, onFocus, ref: refProp }) => {
    const { localize } = useIntl()
    const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown({ disabled })
    const mergedTriggerRef = useMergeRefs(triggerRef, refProp)

    const label = localize({ id: 'smarthr-ui/RichTextEditor/video', defaultText: '動画を挿入' })

    const latest = useLatest({ triggerRef, onKeyDown })

    const functions = useMemo(
      () => ({
        handleTriggerClick: () => setIsOpen((prev) => !prev),
        handleTriggerKeyDown: (e: KeyboardEvent) => {
          switch (e.key) {
            case 'Enter':
            case ' ':
            case 'ArrowDown':
              e.preventDefault()
              e.stopPropagation()
              setIsOpen(true)
              break
            default:
              latest.onKeyDown?.(e)
          }
        },
        handleDismiss: () => {
          setIsOpen(false)
          latest.triggerRef.current?.focus()
        },
        handleInserted: () => setIsOpen(false),
      }),
      [setIsOpen, latest],
    )

    return (
      <>
        <ToolbarButton
          ref={mergedTriggerRef}
          disabled={disabled}
          tabIndex={tabIndex}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          onClick={functions.handleTriggerClick}
          onKeyDown={functions.handleTriggerKeyDown}
          onFocus={onFocus}
          icon={TRIGGER_ICON}
          label={label}
        />
        {renderDropdown(
          <VideoPicker
            handleDismiss={functions.handleDismiss}
            handleInserted={functions.handleInserted}
            label={label}
          />,
        )}
      </>
    )
  },
)
