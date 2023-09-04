import { StoryFn } from '@storybook/react'
import React from 'react'

import { CheckBox } from '../CheckBox'
import { FormControl } from '../FormControl'
import { Input } from '../Input'
import { Cluster, Stack } from '../Layout'
import { RadioButton } from '../RadioButton'
import { Text } from '../Text'

import { Fieldset } from './Fieldset'

export default {
  title: 'Forms（フォーム）/Fieldset',
  component: Fieldset,
}

export const All: StoryFn = () => (
    <Stack gap={2} as="dl">
      <Stack>
        <Text italic color="TEXT_GREY" as="dt">
          基本
        </Text>
        <Stack as="dd">
          <Fieldset title="就業形態" innerMargin={0.5}>
            <Cluster gap={1.25}>
              <RadioButton name="employment" defaultChecked={true}>
                正社員
              </RadioButton>
              <RadioButton name="employment">契約社員</RadioButton>
              <RadioButton name="employment">派遣社員</RadioButton>
              <RadioButton name="employment">アルバイト</RadioButton>
              <RadioButton name="employment">その他</RadioButton>
            </Cluster>
          </Fieldset>
          <Fieldset title="その他の設定" innerMargin={0.5}>
            <CheckBox name="includeBoardMembers">役員を含める</CheckBox>
          </Fieldset>
        </Stack>
      </Stack>
      <Stack>
        <Text italic color="TEXT_GREY" as="dt">
          入れ子
        </Text>
        <dd>
          <Fieldset
            title="アカウントの設定"
            statusLabelProps={{ type: 'grey', children: '任意' }}
            errorMessages="入力されていない項目があります。"
          >
            <Stack>
              <Fieldset title="設定の有無" titleType="subBlockTitle" innerMargin={0.5}>
                <Cluster gap={1.25}>
                  <RadioButton name="existsConfig" defaultChecked={true}>
                    あり
                  </RadioButton>
                  <RadioButton name="existsConfig">なし</RadioButton>
                </Cluster>
              </Fieldset>
              <Cluster gap={1}>
                <FormControl
                  title="姓"
                  titleType="subBlockTitle"
                  errorMessages="姓が入力されていません。"
                >
                  <Input name="lastName" />
                </FormControl>
                <FormControl
                  title="名"
                  titleType="subBlockTitle"
                  errorMessages="名が入力されていません。"
                >
                  <Input name="firstName" />
                </FormControl>
              </Cluster>
            </Stack>
          </Fieldset>
        </dd>
      </Stack>
      <Stack>
        <Text italic color="TEXT_GREY" as="dt">
          disabled
        </Text>
        <dd>
          <Fieldset
            title="disabled なフォームグループ"
            helpMessage="このフォームグループは disabled です。内包するフォームグループを個別に disabled する必要はありません。"
            errorMessages="すべてのフォームコントロールが disabled です。"
            disabled
          >
            <Stack>
              <Fieldset title="就業形態" innerMargin={0.5}>
                <Cluster gap={1.25}>
                  <RadioButton name="employment2">正社員</RadioButton>
                  <RadioButton name="employment2">契約社員</RadioButton>
                  <RadioButton name="employment2">派遣社員</RadioButton>
                  <RadioButton name="employment2">アルバイト</RadioButton>
                  <RadioButton name="employment2">その他</RadioButton>
                </Cluster>
              </Fieldset>
              <Fieldset title="その他の設定" innerMargin={0.5}>
                <CheckBox name="includeBoardMembers">役員を含める</CheckBox>
              </Fieldset>
              <Cluster gap={1}>
                <FormControl
                  title="姓"
                  titleType="subBlockTitle"
                  errorMessages="姓が入力されていません。"
                >
                  <Input name="lastName" />
                </FormControl>
                <FormControl
                  title="名"
                  titleType="subBlockTitle"
                  errorMessages="名が入力されていません。"
                >
                  <Input name="firstName" />
                </FormControl>
              </Cluster>
            </Stack>
          </Fieldset>
        </dd>
      </Stack>
    </Stack>
  )
All.storyName = 'all'
