import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { IntlProvider } from '../../intl'

import { DropZone } from './DropZone'

// FileList のモックヘルパー
const createFileList = (files: File[]): FileList => {
  const fileList = {
    length: files.length,
    item: (index: number) => files[index] ?? null,
    [Symbol.iterator]: function* () {
      yield* files
    },
  }
  files.forEach((file, index) => {
    Object.defineProperty(fileList, index, {
      value: file,
      enumerable: true,
    })
  })
  return fileList as FileList
}

describe('DropZone', () => {
  describe('onSelectFiles', () => {
    describe('ファイルをドロップした場合', () => {
      it('onSelectFiles が発火する', () => {
        const onSelectFiles = vi.fn()
        const { container } = render(
          <IntlProvider locale="ja">
            <DropZone name="test_file" onSelectFiles={onSelectFiles}>
              ファイルをドロップ
            </DropZone>
          </IntlProvider>,
        )

        const dropZone = container.querySelector('.smarthr-ui-DropZone')
        if (!dropZone) throw new Error('DropZone not found')

        const file = new File(['content'], 'test.txt', { type: 'text/plain' })
        const fileList = createFileList([file])
        const dataTransfer = {
          files: fileList,
          types: ['Files'],
        }

        fireEvent.drop(dropZone, { dataTransfer })

        expect(onSelectFiles).toHaveBeenCalledTimes(1)
        expect(onSelectFiles).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            length: 1,
          }),
        )
      })
    })

    describe('テキストをドロップした場合', () => {
      it('onSelectFiles が発火しない', () => {
        const onSelectFiles = vi.fn()
        const { container } = render(
          <IntlProvider locale="ja">
            <DropZone name="test_file" onSelectFiles={onSelectFiles}>
              ファイルをドロップ
            </DropZone>
          </IntlProvider>,
        )

        const dropZone = container.querySelector('.smarthr-ui-DropZone')
        if (!dropZone) throw new Error('DropZone not found')

        const fileList = createFileList([])
        const dataTransfer = {
          files: fileList,
          types: ['text/plain'],
        }

        fireEvent.drop(dropZone, { dataTransfer })

        expect(onSelectFiles).not.toHaveBeenCalled()
      })
    })

    describe('URLをドロップした場合', () => {
      it('onSelectFiles が発火しない', () => {
        const onSelectFiles = vi.fn()
        const { container } = render(
          <IntlProvider locale="ja">
            <DropZone name="test_file" onSelectFiles={onSelectFiles}>
              ファイルをドロップ
            </DropZone>
          </IntlProvider>,
        )

        const dropZone = container.querySelector('.smarthr-ui-DropZone')
        if (!dropZone) throw new Error('DropZone not found')

        const fileList = createFileList([])
        const dataTransfer = {
          files: fileList,
          types: ['text/uri-list'],
        }

        fireEvent.drop(dropZone, { dataTransfer })

        expect(onSelectFiles).not.toHaveBeenCalled()
      })
    })

    describe('ボタンクリックでファイルを選択した場合', () => {
      it('onSelectFiles が発火する', async () => {
        const onSelectFiles = vi.fn()
        render(
          <IntlProvider locale="ja">
            <DropZone name="test_file" onSelectFiles={onSelectFiles}>
              ファイルをドロップ
            </DropZone>
          </IntlProvider>,
        )

        const input = document.querySelector('input[type="file"]') as HTMLInputElement
        if (!input) throw new Error('Input not found')

        const file = new File(['content'], 'test.txt', { type: 'text/plain' })
        await userEvent.upload(input, file)

        expect(onSelectFiles).toHaveBeenCalledTimes(1)
        expect(onSelectFiles).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            length: 1,
          }),
        )
      })
    })
  })
})
