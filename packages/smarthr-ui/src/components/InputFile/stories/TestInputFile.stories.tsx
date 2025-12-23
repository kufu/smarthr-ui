import { useState } from 'react'
import { BaseColumn } from '../../Base'
import { Button } from '../../Button'
import { FormControl } from '../../FormControl'
import { Stack } from '../../Layout'
import { Text } from '../../Text'
import { InputFile } from '../InputFile'
import { InformationPanel } from '../../InformationPanel'

import type { Meta } from '@storybook/react'
import { Heading } from '../../Heading'

export default {
  title: 'Components/InputFile/Test',
  component: InputFile,
  render: (args) => <InputFile {...args} />,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof InputFile>

export const ManualTest1 = () => {
  const [result, setResult] = useState<string>('')
  return (
    <Stack>
      <InformationPanel type="info" title="multipleかつsubmitのテスト">
        <ol className="shr-ms-1.5">
          <li>「ファイルを選択」ボタンを押して、複数のファイルを選択してください。</li>
          <li>「送信」ボタンを押してください。</li>
          <li>送信結果に選択したファイル名が表示されていることを確認してください。</li>
          <li>ファイルを1つ削除してください。</li>
          <li>「送信」ボタンを押してください。</li>
          <li>送信結果に削除したファイル名が表示されていないことを確認してください。</li>
        </ol>
      </InformationPanel>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const data = new FormData(e.currentTarget)
          setResult(
            data
              .getAll('files')
              .map((file) => (file instanceof File ? file.name : ''))
              .join('\n'),
          )
        }}
      >
        <Stack>
          <FormControl title="ファイル">
            <InputFile label="ファイルを選択" name="files" multiple hasFileList />
          </FormControl>
          <Button type="submit">送信</Button>
        </Stack>
      </form>
      <Heading>送信結果</Heading>
      <BaseColumn>
        <Text as="output" className="shr-whitespace-pre">
          {result}
        </Text>
      </BaseColumn>
    </Stack>
  )
}

export const ManualTest2 = () => {
  const [result, setResult] = useState<string>('')
  return (
    <Stack>
      <InformationPanel type="info" title="multiple.appendableかつsubmitのテスト">
        <ol className="shr-ms-1.5">
          <li>「ファイルを選択」ボタンを押して、複数のファイルを選択してください。</li>
          <li>「送信」ボタンを押してください。</li>
          <li>再度「ファイルを選択」ボタンを押して、複数のファイルを選択してください。</li>
          <li>「送信」ボタンを押してください。</li>
          <li>送信結果に選択したファイル名が追加されていることを確認してください。</li>
          <li>ファイルを1つ削除してください。</li>
          <li>「送信」ボタンを押してください。</li>
          <li>送信結果に削除したファイル名が表示されていないことを確認してください。</li>
        </ol>
      </InformationPanel>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const data = new FormData(e.currentTarget)
          setResult(
            data
              .getAll('files')
              .map((file) => (file instanceof File ? file.name : ''))
              .join('\n'),
          )
        }}
      >
        <Stack>
          <FormControl title="ファイル">
            <InputFile
              label="ファイルを選択"
              name="files"
              multiple={{ appendable: true }}
              hasFileList
            />
          </FormControl>
          <Button type="submit">送信</Button>
        </Stack>
      </form>
      <Heading>送信結果</Heading>
      <BaseColumn>
        <Text as="output" className="shr-whitespace-pre">
          {result}
        </Text>
      </BaseColumn>
    </Stack>
  )
}

export const ManualTest3 = () => {
  const [value, setValue] = useState<File[]>([])
  return (
    <Stack>
      <InformationPanel type="info" title="multipleかつonChangeのテスト">
        <ol className="shr-ms-1.5">
          <li>「ファイルを選択」ボタンを押して、複数のファイルを選択してください。</li>
          <li>送信結果に選択したファイル名が追加されていることを確認してください。</li>
          <li>ファイルを1つ削除してください。</li>
          <li>送信結果に削除したファイル名が表示されていないことを確認してください。</li>
        </ol>
      </InformationPanel>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Stack>
          <FormControl title="ファイル">
            <InputFile
              onChange={(files) => {
                setValue(files)
              }}
              label="ファイルを選択"
              name="files"
              multiple
              hasFileList
            />
          </FormControl>
        </Stack>
      </form>
      <Heading>onChange</Heading>
      <BaseColumn>
        <Text as="output" className="shr-whitespace-pre">
          {value.map((file) => file.name).join('\n')}
        </Text>
      </BaseColumn>
    </Stack>
  )
}

export const ManualTest4 = () => {
  const [value, setValue] = useState<File[]>([])
  return (
    <Stack>
      <InformationPanel type="info" title="multiple.appendableかつonChangeのテスト">
        <ol className="shr-ms-1.5">
          <li>「ファイルを選択」ボタンを押して、複数のファイルを選択してください。</li>
          <li>送信結果に選択したファイル名が追加されていることを確認してください。</li>
          <li>再度「ファイルを選択」ボタンを押して、複数のファイルを選択してください。</li>
          <li>ファイルを1つ削除してください。</li>
          <li>送信結果に削除したファイル名が表示されていないことを確認してください。</li>
          <li>消したファイルを再度選択してください。</li>
          <li>送信結果に再度選択したファイル名が追加されていることを確認してください。</li>
        </ol>
      </InformationPanel>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Stack>
          <FormControl title="ファイル">
            <InputFile
              onChange={(files) => {
                setValue(files)
              }}
              label="ファイルを選択"
              name="files"
              multiple={{ appendable: true }}
              hasFileList
            />
          </FormControl>
        </Stack>
      </form>
      <Heading>onChange</Heading>
      <BaseColumn>
        <Text as="output" className="shr-whitespace-pre">
          {value.map((file) => file.name).join('\n')}
        </Text>
      </BaseColumn>
    </Stack>
  )
}
