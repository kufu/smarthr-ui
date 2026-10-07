import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { IntlProvider } from '../../intl'

import { DropZone } from './DropZone'

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

// jsdom は input.files への FileList 代入をサポートしないため、セッターをスタブする
const stubInputFilesSetter = (
  setter: (this: HTMLInputElement, files: FileList) => void = vi.fn(),
) => {
  const original = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'files')!
  beforeEach(() => {
    Object.defineProperty(HTMLInputElement.prototype, 'files', {
      ...original,
      set: setter,
    })
  })
  afterEach(() => {
    Object.defineProperty(HTMLInputElement.prototype, 'files', original)
  })
}

describe('DropZone', () => {
  describe('onSelectFiles', () => {
    describe('ファイルをドロップした場合', () => {
      stubInputFilesSetter()

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

        const input = document.querySelector<HTMLInputElement>('input[type="file"]')
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

  describe('multiple={{ appendable: true }} の場合', () => {
    const filesSetter = vi.fn()
    stubInputFilesSetter(filesSetter)

    // jsdom は DataTransfer をサポートしないため、追加されたファイルを配列で返すスタブに差し替える
    beforeEach(() => {
      filesSetter.mockReset()
      vi.stubGlobal(
        'DataTransfer',
        class {
          files: File[] = []
          items = { add: (file: File) => this.files.push(file) }
        },
      )
    })
    afterEach(() => {
      vi.unstubAllGlobals()
    })

    const existingFile = new File(['existing'], 'existing.txt', { type: 'text/plain' })
    const newFile = new File(['new'], 'new.txt', { type: 'text/plain' })

    const renderAppendable = (files: File[], onSelectFiles = vi.fn()) =>
      render(
        <IntlProvider locale="ja">
          <DropZone
            name="test_file"
            multiple={{ appendable: true }}
            files={files}
            onSelectFiles={onSelectFiles}
          >
            ファイルをドロップ
          </DropZone>
        </IntlProvider>,
      )

    it('ドロップしたファイルを選択済みのファイルに結合して onSelectFiles に渡す', () => {
      const onSelectFiles = vi.fn()
      const { container } = renderAppendable([existingFile], onSelectFiles)

      const dropZone = container.querySelector('.smarthr-ui-DropZone')
      if (!dropZone) throw new Error('DropZone not found')

      fireEvent.drop(dropZone, {
        dataTransfer: { files: createFileList([newFile]), types: ['Files'] },
      })

      expect(onSelectFiles).toHaveBeenCalledTimes(1)
      expect(onSelectFiles).toHaveBeenCalledWith(expect.anything(), [existingFile, newFile])
    })

    it('ボタンから選択したファイルを選択済みのファイルに結合して onSelectFiles に渡す', async () => {
      const onSelectFiles = vi.fn()
      renderAppendable([existingFile], onSelectFiles)

      const input = document.querySelector<HTMLInputElement>('input[type="file"]')
      if (!input) throw new Error('Input not found')

      await userEvent.upload(input, newFile)

      expect(onSelectFiles).toHaveBeenCalledTimes(1)
      expect(onSelectFiles).toHaveBeenCalledWith(expect.anything(), [existingFile, newFile])
    })

    it('input.files を files に同期する', () => {
      const { rerender } = renderAppendable([existingFile])

      expect(filesSetter).toHaveBeenLastCalledWith([existingFile])

      rerender(
        <IntlProvider locale="ja">
          <DropZone
            name="test_file"
            multiple={{ appendable: true }}
            files={[existingFile, newFile]}
            onSelectFiles={vi.fn()}
          >
            ファイルをドロップ
          </DropZone>
        </IntlProvider>,
      )

      expect(filesSetter).toHaveBeenLastCalledWith([existingFile, newFile])
    })

    it('input.files の同期で change が発火しても onSelectFiles は呼ばれない', () => {
      // Safari の input.files 代入時の挙動を再現する
      filesSetter.mockImplementation(function (this: HTMLInputElement) {
        fireEvent.change(this)
      })
      const onSelectFiles = vi.fn()
      renderAppendable([existingFile], onSelectFiles)

      expect(filesSetter).toHaveBeenCalled()
      expect(onSelectFiles).not.toHaveBeenCalled()
    })
  })
})
