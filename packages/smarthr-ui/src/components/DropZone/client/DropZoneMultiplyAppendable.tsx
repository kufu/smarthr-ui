'use client'

import {
  type ChangeEvent,
  type ComponentPropsWithRef,
  type DragEvent,
  type FC,
  useMemo,
  useRef,
} from 'react'

import { useLayoutEffectRef } from '../../../hooks/client/useLayoutEffectRef'
import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { useLatest } from '../../../hooks/useLatest'

import { ActualDropZone } from './ActualDropZone'

type Props = Omit<ComponentPropsWithRef<typeof ActualDropZone>, 'multiple' | 'onSelectFiles'> & {
  /** 選択済みのファイル */
  files: File[]
  /**
   * ボタンまたはドラッグ&ドロップでファイルが追加された時に発火するコールバック関数
   * <b>（選択済みのファイルに今回追加されたファイルを結合したものが渡されます）</b>
   */
  onSelectFiles: (e: DragEvent<HTMLElement> | ChangeEvent<HTMLInputElement>, files: File[]) => void
}

export const DropZoneMultiplyAppendable: FC<Props> = ({ files, onSelectFiles, ref, ...rest }) => {
  // Safari において、input.files への直接代入時に onChange が発火することを防ぐためのフラグ
  const isUpdatingFilesRef = useRef(false)

  const latest = useLatest({ files, onSelectFiles })

  const functions = useMemo(
    () => ({
      handleSelectFiles: (
        e: DragEvent<HTMLElement> | ChangeEvent<HTMLInputElement>,
        newFiles: FileList | null,
      ) => {
        if (!isUpdatingFilesRef.current) {
          latest.onSelectFiles(e, [...latest.files, ...Array.from(newFiles ?? [])])
        }
      },
    }),
    [latest],
  )

  const syncFilesRef = useLayoutEffectRef<HTMLInputElement>(
    (input) => {
      if (!input) {
        return
      }

      const buff = new DataTransfer()
      files.forEach((file) => {
        buff.items.add(file)
      })

      isUpdatingFilesRef.current = true
      input.files = buff.files
      isUpdatingFilesRef.current = false
    },
    [files],
  )

  const mergedRef = useMergeRefs(syncFilesRef, ref)

  return (
    <ActualDropZone
      {...rest}
      ref={mergedRef}
      multiple
      onSelectFiles={functions.handleSelectFiles}
    />
  )
}
