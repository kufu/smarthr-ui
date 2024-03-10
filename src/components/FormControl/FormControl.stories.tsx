import { StoryFn } from '@storybook/react'
import React from 'react'

import { MultiComboBox, SingleComboBox } from '../ComboBox'
import { DatePicker } from '../DatePicker'
import { DropZone } from '../DropZone'
import { CurrencyInput, Input } from '../Input'
import { InputFile } from '../InputFile'
import { Stack } from '../Layout'
import { Select } from '../Select'
import { Text } from '../Text'
import { Textarea } from '../Textarea'

import { FormControl } from './FormControl'

export default {
  title: 'Forms（フォーム）/FormControl',
  component: FormControl,
}

export const All: StoryFn = () => (
  <Stack gap={2} as="dl" className="shr-my-[unset] [&_dd]:shr-ms-[unset]">
    <Stack>
      <Text italic color="TEXT_GREY" as="dt">
        基本
      </Text>
      <dd>
        <FormControl title="フォームコントロール名">
          <Input name="defaultInput" />
        </FormControl>
      </dd>
    </Stack>
    <Stack>
      <Text italic color="TEXT_GREY" as="dt">
        すべてのオプション
      </Text>
      <dd>
        <FormControl
          title="氏名"
          statusLabelProps={{ type: 'grey', children: '任意' }}
          helpMessage="氏名を入力してください。"
          errorMessages={'氏名が入力されていません。'}
        >
          <Input name="fullname" width="100%" />
        </FormControl>
      </dd>
    </Stack>
    <Stack>
      <Text italic color="TEXT_GREY" as="dt">
        読み取り専用
      </Text>
      <dd>
        <FormControl title="氏名">
          <Input name="fullname" value="草野栄一郎" readOnly />
        </FormControl>
      </dd>
    </Stack>
    <Stack>
      <Text italic color="TEXT_GREY" as="dt">
        各種コントロールが紐づくこと
      </Text>
      <dd>
        <FormControl title="Input" helpMessage="Input に紐づく説明です。">
          <Input name="input" value="Input コンポーネント" />
        </FormControl>
      </dd>
      <dd>
        <FormControl title="CurrencyInput" helpMessage="CurrencyInput に紐づく説明です。">
          <CurrencyInput name="currency_input" value="CurrencyInput コンポーネント" />
        </FormControl>
      </dd>
      <dd>
        <FormControl title="Textarea" helpMessage="Textaea に紐づく説明です。">
          <Textarea name="textarea" value="Textarea コンポーネント" />
        </FormControl>
      </dd>
      <dd>
        <FormControl title="DatePicker" helpMessage="DatePicker に紐づく説明です。">
          <DatePicker name="date_picker" value="DatePicker コンポーネント" />
        </FormControl>
      </dd>
      <dd>
        <FormControl title="Select" helpMessage="Select に紐づく説明です。">
          <Select
            name="select"
            options={[{ label: 'Select コンポーネント', value: 'select_component' }]}
          />
        </FormControl>
      </dd>
      <dd>
        <FormControl title="SingleComboBox" helpMessage="SingleComboBox に紐づく説明です。">
          <SingleComboBox
            name="single_combobox"
            items={[{ label: 'SingleComboBox コンポーネント', value: 'single_combobox' }]}
            selectedItem={{ label: 'SingleComboBox コンポーネント', value: 'single_combobox' }}
          />
        </FormControl>
      </dd>
      <dd>
        <FormControl title="MultiComboBox" helpMessage="MultiComboBox に紐づく説明です。">
          <MultiComboBox
            name="multi_combobox"
            items={[{ label: 'MultiComboBox コンポーネント', value: 'single_combobox' }]}
            selectedItems={[{ label: 'MultiComboBox コンポーネント', value: 'single_combobox' }]}
          />
        </FormControl>
      </dd>
      <dd>
        <FormControl title="InputFile" helpMessage="InputFile に紐づく説明です。">
          <InputFile name="input_fil" label="InputFile コンポーネント" />
        </FormControl>
      </dd>
      <dd>
        <FormControl title="DropZone" helpMessage="DropZone に紐づく説明です。">
          <DropZone name="drop_zone" onSelectFiles={() => null} />
        </FormControl>
      </dd>
    </Stack>
  </Stack>
)
All.storyName = 'all'
