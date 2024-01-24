import { StoryFn } from '@storybook/react'
import React from 'react'

import { Input } from '../Input'
import { Cluster, Stack } from '../Layout'
import { Text } from '../Text'

import { FormGroup } from './FormGroup'
import { Fieldset } from './NewFieldset'

export default {
  title: 'Forms（フォーム）/FormGroup（非推奨）',
  component: FormGroup,
}

export const All: StoryFn = () => (
  <Stack gap={2} as="dl">
    <Stack>
      <Text italic color="TEXT_GREY" as="dt">
        基本
      </Text>
      <dd>
        <FormGroup title="フォームコントロール名">
          <Input name="defaultInput" />
        </FormGroup>
      </dd>
    </Stack>
    <Stack>
      <Text italic color="TEXT_GREY" as="dt">
        すべてのオプション
      </Text>
      <dd>
        <FormGroup
          title="氏名"
          statusLabelProps={{ type: 'grey', children: '任意' }}
          helpMessage="氏名を入力してください。"
          exampleMessage="例：草野栄一郎"
          errorMessages={'氏名が入力されていません。'}
          supplementaryMessage="※ 補足文はフォームコントロールの下に表示します。"
        >
          <Input name="fullname" />
        </FormGroup>
      </dd>
    </Stack>
    <Stack>
      <Text italic color="TEXT_GREY" as="dt">
        入れ子
      </Text>
      <dd>
        <Fieldset
          title="姓名"
          statusLabelProps={{ type: 'grey', children: '任意' }}
          helpMessage="姓名を入力してください。"
          errorMessages="姓名が入力されていません。"
        >
          <Cluster gap={1}>
            <FormGroup
              title="姓"
              titleType="subSubBlockTitle"
              errorMessages="姓が入力されていません。"
            >
              <Input name="lastName" />
            </FormGroup>
            <FormGroup
              title="名"
              titleType="subSubBlockTitle"
              errorMessages="名が入力されていません。"
            >
              <Input name="firstName" />
            </FormGroup>
          </Cluster>
        </Fieldset>
      </dd>
    </Stack>
    <Stack>
      <Text italic color="TEXT_GREY" as="dt">
        読み取り専用
      </Text>
      <dd>
        <Fieldset title="姓名">
          <Cluster gap={1}>
            <FormGroup title="姓" titleType="subSubBlockTitle">
              <Input name="lastName" value="草野" readOnly />
            </FormGroup>
            <FormGroup title="名" titleType="subSubBlockTitle">
              <Input name="firstName" value="栄一郎" readOnly />
            </FormGroup>
          </Cluster>
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
          <Cluster gap={1}>
            <FormGroup
              title="姓"
              titleType="subSubBlockTitle"
              errorMessages="姓が入力されていません。"
            >
              <Input name="lastName" />
            </FormGroup>
            <FormGroup
              title="名"
              titleType="subSubBlockTitle"
              errorMessages="名が入力されていません。"
            >
              <Input name="firstName" />
            </FormGroup>
          </Cluster>
        </Fieldset>
      </dd>
    </Stack>
  </Stack>
)
All.storyName = 'all'
