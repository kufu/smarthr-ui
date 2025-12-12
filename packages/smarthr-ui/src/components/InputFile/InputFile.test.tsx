import { render, screen } from '@testing-library/react'
import { userEvent } from 'storybook/test'

import { IntlProvider } from '../../intl'
import { FormControl } from '../FormControl'

import { InputFile } from './InputFile'

describe('InputFile', () => {
  const file1 = new File(['foo'], 'foo.txt', { type: 'text/plain' })
  const file2 = new File(['bar'], 'bar.txt', { type: 'text/plain' })

  it('ファイル選択時にonChangeが発火すること', async () => {
    const onChange = vi.fn()
    await render(
      <IntlProvider locale="ja">
        <form>
          <FormControl title="input file">
            <InputFile name="test" label="input file" onChange={onChange} />
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
          <FormControl title="input file">
            <InputFile name="test" label="input file" multiple onChange={onChange} />
          </FormControl>
        </form>
      </IntlProvider>,
    )
    const input = screen.getByLabelText('input file')
    await userEvent.upload(input, [file1, file2])
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith([file1, file2])
  })

  // TODO: テストでコケてしまうためコメントアウトしています
  // it('multiple.appendableでファイル選択時にonChangeが発火すること', async () => {
  //   const onChange = vi.fn()
  //   await render(
  //     <IntlProvider locale="ja">
  //       <form>
  //         <FormControl title="input file">
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
          <FormControl title="input file">
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
          <FormControl title="input file">
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
          <FormControl title="input file">
            <InputFile name="test" label="input file" multiple />
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
          <FormControl title="input file">
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
})
