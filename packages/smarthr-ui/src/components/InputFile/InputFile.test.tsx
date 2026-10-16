import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { IntlProvider } from '../../intl'
import { FormControl } from '../FormGroup'

import { InputFile } from './InputFile'

describe('InputFile', () => {
  const file1 = new File(['foo'], 'foo.txt', { type: 'text/plain' })
  const file2 = new File(['bar'], 'bar.txt', { type: 'text/plain' })

  it('ファイル選択時にonChangeが発火すること', async () => {
    const onChange = vi.fn()
    await render(
      <IntlProvider locale="ja">
        <form>
          <FormControl label="input file">
            <InputFile name="test" onChange={onChange} label="input file" />
          </FormControl>
        </form>
      </IntlProvider>,
    )
    const input = screen.getByLabelText('input file')
    await userEvent.upload(input, file1)
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith([file1])
  })

  it('multipleでファイル選択時にonChangeが発火すること', async () => {
    const onChange = vi.fn()
    await render(
      <IntlProvider locale="ja">
        <form>
          <FormControl label="input file">
            <InputFile name="test" multiple onChange={onChange} label="input file" />
          </FormControl>
        </form>
      </IntlProvider>,
    )
    const input = screen.getByLabelText('input file')
    await userEvent.upload(input, [file1, file2])
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith([file1, file2])
  })

  // FIXME: DataTransferで落ちるので修正が必要
  // it('multiple.appendableでファイル選択時にonChangeが発火すること', async () => {
  //   const onChange = vi.fn()
  //   await render(
  //     <IntlProvider locale="ja">
  //       <form>
  //         <FormControl label="input file">
  //           <InputFile
  //             name="test"
  //             label="input file"
  //             multiple={{ appendable: true }}
  //             onChange={onChange}
  //           />
  //         </FormControl>
  //       </form>
  //     </IntlProvider>,
  //   )
  //   const input = screen.getByLabelText('input file')
  //   await userEvent.upload(input, file1)
  //   expect(onChange).toHaveBeenCalledOnce()
  //   expect(onChange).toHaveBeenCalledWith([file1])
  // })

  it('ファイル選択後、ファイルリストが表示されること', async () => {
    await render(
      <IntlProvider locale="ja">
        <form>
          <FormControl label="input file">
            <InputFile name="test" label="input file" />
          </FormControl>
        </form>
      </IntlProvider>,
    )
    const input = screen.getByLabelText('input file')
    await userEvent.upload(input, file1)
    expect(screen.getByText(file1.name)).toBeInTheDocument()
  })

  // FIXME: DataTransferで落ちるので修正が必要
  it.skip('ファイル選択後、削除するとinputのvalueには存在しないこと', async () => {
    await render(
      <IntlProvider locale="ja">
        <form>
          <FormControl label="input file">
            <InputFile name="test" label="input file" />
          </FormControl>
        </form>
      </IntlProvider>,
    )
    const input: HTMLInputElement = screen.getByLabelText('input file')
    await userEvent.upload(input, file1)
    expect(input.files).toHaveLength(1)
    const deleteButton = screen.getByRole('button', { name: '削除' })
    await userEvent.click(deleteButton)
    expect(input.files).toHaveLength(0)
  })

  // FIXME: DataTransferで落ちるので修正が必要
  it.skip('multipleで複数ファイル選択後、1つ削除すると削除したもののみinputのvalueには存在しないこと', async () => {
    await render(
      <IntlProvider locale="ja">
        <form>
          <FormControl label="input file">
            <InputFile name="test" multiple label="input file" />
          </FormControl>
        </form>
      </IntlProvider>,
    )
    const input: HTMLInputElement = screen.getByLabelText('input file')
    await userEvent.upload(input, [file1, file2])
    expect(input.files).toHaveLength(2)
    const deleteButton = screen.getAllByRole('button', { name: '削除' })[0]
    await userEvent.click(deleteButton)
    expect(input.files).toHaveLength(1)
  })

  // FIXME: DataTransferで落ちるので修正が必要
  it.skip('ファイル削除後、ファイルリストに存在しないこと', async () => {
    await render(
      <IntlProvider locale="ja">
        <form>
          <FormControl label="input file">
            <InputFile name="test" label="input file" />
          </FormControl>
        </form>
      </IntlProvider>,
    )
    const input = screen.getByLabelText('input file')
    await userEvent.upload(input, file1)
    expect(screen.getByText(file1.name)).toBeInTheDocument()
    const deleteButton = screen.getByRole('button', { name: '削除' })
    await userEvent.click(deleteButton)
    expect(screen.queryByText(file1.name)).not.toBeInTheDocument()
  })

  describe('defaultExistingFiles', () => {
    const existingFile1 = { name: 'existing1.pdf', url: 'https://example.com/existing1.pdf' }
    const existingFile2 = { name: 'existing2.pdf', url: 'https://example.com/existing2.pdf' }

    it('マウント時点でファイルリストに表示されること', async () => {
      await render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="input file">
              <InputFile name="test" defaultExistingFiles={[existingFile1]} label="input file" />
            </FormControl>
          </form>
        </IntlProvider>,
      )
      expect(screen.getByText(existingFile1.name)).toBeInTheDocument()
    })

    it('新規選択ファイルと同一リストに混在表示され、表示順が既存→新規になること', async () => {
      await render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="input file">
              <InputFile
                name="test"
                multiple
                defaultExistingFiles={[existingFile1]}
                label="input file"
              />
            </FormControl>
          </form>
        </IntlProvider>,
      )
      const input = screen.getByLabelText('input file')
      await userEvent.upload(input, file1)

      const items = screen.getAllByRole('listitem')
      expect(items).toHaveLength(2)
      expect(items[0]).toHaveTextContent(existingFile1.name)
      expect(items[1]).toHaveTextContent(file1.name)
    })

    it('削除ボタンをクリックすると一覧から消え、onDeleteExistingFileが正しい引数で呼ばれること', async () => {
      const onDeleteExistingFile = vi.fn()
      await render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="input file">
              <InputFile
                name="test"
                defaultExistingFiles={[existingFile1]}
                onDeleteExistingFile={onDeleteExistingFile}
                label="input file"
              />
            </FormControl>
          </form>
        </IntlProvider>,
      )
      const deleteButton = screen.getByRole('button', { name: '削除' })
      await userEvent.click(deleteButton)

      expect(screen.queryByText(existingFile1.name)).not.toBeInTheDocument()
      expect(onDeleteExistingFile).toHaveBeenCalledOnce()
      expect(onDeleteExistingFile).toHaveBeenCalledWith(existingFile1, 0)
    })

    it('複数件ある場合、2件目を削除しても正しいindexで処理されること', async () => {
      const onDeleteExistingFile = vi.fn()
      await render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="input file">
              <InputFile
                name="test"
                defaultExistingFiles={[existingFile1, existingFile2]}
                onDeleteExistingFile={onDeleteExistingFile}
                label="input file"
              />
            </FormControl>
          </form>
        </IntlProvider>,
      )
      const deleteButtons = screen.getAllByRole('button', { name: '削除' })
      await userEvent.click(deleteButtons[1])

      expect(screen.queryByText(existingFile1.name)).toBeInTheDocument()
      expect(screen.queryByText(existingFile2.name)).not.toBeInTheDocument()
      expect(onDeleteExistingFile).toHaveBeenCalledOnce()
      expect(onDeleteExistingFile).toHaveBeenCalledWith(existingFile2, 1)
    })

    it('削除してもonChangeが呼ばれないこと', async () => {
      const onChange = vi.fn()
      await render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="input file">
              <InputFile
                name="test"
                defaultExistingFiles={[existingFile1]}
                onChange={onChange}
                label="input file"
              />
            </FormControl>
          </form>
        </IntlProvider>,
      )
      const deleteButton = screen.getByRole('button', { name: '削除' })
      await userEvent.click(deleteButton)

      expect(onChange).not.toHaveBeenCalled()
    })

    it('hasFileList={false}の場合、リストが表示されないこと', async () => {
      await render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="input file">
              <InputFile
                name="test"
                hasFileList={false}
                defaultExistingFiles={[existingFile1]}
                label="input file"
              />
            </FormControl>
          </form>
        </IntlProvider>,
      )
      expect(screen.queryByText(existingFile1.name)).not.toBeInTheDocument()
    })

    it('multiple={{ appendable: true }}でも表示・削除が機能すること', async () => {
      const onDeleteExistingFile = vi.fn()
      await render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="input file">
              <InputFile
                name="test"
                multiple={{ appendable: true }}
                defaultExistingFiles={[existingFile1]}
                onDeleteExistingFile={onDeleteExistingFile}
                label="input file"
              />
            </FormControl>
          </form>
        </IntlProvider>,
      )
      expect(screen.getByText(existingFile1.name)).toBeInTheDocument()

      const deleteButton = screen.getByRole('button', { name: '削除' })
      await userEvent.click(deleteButton)

      expect(screen.queryByText(existingFile1.name)).not.toBeInTheDocument()
      expect(onDeleteExistingFile).toHaveBeenCalledWith(existingFile1, 0)
    })

    it('previewable指定時、contentType未指定の項目はダウンロードリンクとして表示されること', async () => {
      await render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="input file">
              <InputFile
                name="test"
                previewable
                defaultExistingFiles={[existingFile1]}
                label="input file"
              />
            </FormControl>
          </form>
        </IntlProvider>,
      )
      const link = screen.getByRole('link', {
        name: new RegExp(`${existingFile1.name}をダウンロード`),
      })
      expect(link).toHaveAttribute('href', existingFile1.url)
    })

    it('クロスオリジンのURLの場合、ダウンロードリンクにtarget="_blank"が設定されること', async () => {
      await render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="input file">
              <InputFile
                name="test"
                previewable
                defaultExistingFiles={[existingFile1]}
                label="input file"
              />
            </FormControl>
          </form>
        </IntlProvider>,
      )
      const link = screen.getByRole('link', {
        name: new RegExp(`${existingFile1.name}をダウンロード`),
      })
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('同一オリジンのURLの場合、ダウンロードリンクにtarget属性が設定されないこと', async () => {
      const sameOriginFile = { name: 'same-origin.pdf', url: '/fixtures/sample.pdf' }
      await render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="input file">
              <InputFile
                name="test"
                previewable
                defaultExistingFiles={[sameOriginFile]}
                label="input file"
              />
            </FormControl>
          </form>
        </IntlProvider>,
      )
      const link = screen.getByRole('link', {
        name: new RegExp(`${sameOriginFile.name}をダウンロード`),
      })
      expect(link).not.toHaveAttribute('target')
    })

    it('data URLの場合、ダウンロードリンクにtarget属性が設定されないこと', async () => {
      const dataUrlFile = { name: 'data-url.txt', url: 'data:text/plain,hello' }
      await render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="input file">
              <InputFile
                name="test"
                previewable
                defaultExistingFiles={[dataUrlFile]}
                label="input file"
              />
            </FormControl>
          </form>
        </IntlProvider>,
      )
      const link = screen.getByRole('link', {
        name: new RegExp(`${dataUrlFile.name}をダウンロード`),
      })
      expect(link).not.toHaveAttribute('target')
    })

    it('previewable指定時、contentTypeがimageの項目はプレビューボタンとして表示されること', async () => {
      const imageFile = {
        name: 'image.png',
        url: 'https://example.com/image.png',
        contentType: 'image/png',
      }
      await render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="input file">
              <InputFile
                name="test"
                previewable
                defaultExistingFiles={[imageFile]}
                label="input file"
              />
            </FormControl>
          </form>
        </IntlProvider>,
      )
      expect(
        screen.getByRole('button', { name: new RegExp(`${imageFile.name}のプレビューを開く`) }),
      ).toBeInTheDocument()
    })
  })
})
