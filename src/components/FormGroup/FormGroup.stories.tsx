import { StoryFn } from '@storybook/react'
import React from 'react'

import { Input } from '../Input'
import { Cluster, Stack } from '../Layout'
import { Text } from '../Text'

import { FormGroup } from './FormGroup'

export default {
  title: 'Forms（フォーム）/FormGroup（非推奨）',
  component: FormGroup,
}

export const All: StoryFn = () => {
  return (
    <Stack gap={2} as="dl">
      <Stack>
        <Text italic color="TEXT_GREY" as="dt">
          基本
        </Text>
        <dd>
          <FormGroup title="フォームコントロール名" htmlFor="form_1">
            <Input name="defaultInput" id="form_1" />
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
            errorMessages={'氏名が入力されていません。'}
            htmlFor="form_2"
          >
            <Input name="fullname" id="form_2" />
          </FormGroup>
        </dd>
      </Stack>
      <Stack>
        <Text italic color="TEXT_GREY" as="dt">
          入れ子
        </Text>
        <dd>
          <FormGroup
            as="fieldset"
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
                htmlFor="form_3"
              >
                <Input name="lastName" id="form_3" />
              </FormGroup>
              <FormGroup
                title="名"
                titleType="subSubBlockTitle"
                errorMessages="名が入力されていません。"
                htmlFor="form_4"
              >
                <Input name="firstName" id="form_4" />
              </FormGroup>
            </Cluster>
          </FormGroup>
        </dd>
      </Stack>
      <Stack>
        <Text italic color="TEXT_GREY" as="dt">
          読み取り専用
        </Text>
        <dd>
          <FormGroup title="姓名" as="fieldset">
            <Cluster gap={1}>
              <FormGroup title="姓" titleType="subSubBlockTitle" htmlFor="form_5">
                <Input name="lastName" value="草野" readOnly id="form_5" />
              </FormGroup>
              <FormGroup title="名" titleType="subSubBlockTitle" htmlFor="form_6">
                <Input name="firstName" value="栄一郎" readOnly id="form_6" />
              </FormGroup>
            </Cluster>
          </FormGroup>
        </dd>
      </Stack>
      <Stack>
        <Text italic color="TEXT_GREY" as="dt">
          disabled
        </Text>
        <dd>
          <FormGroup
            as="fieldset"
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
                htmlFor="form_7"
              >
                <Input name="lastName" id="form_7" />
              </FormGroup>
              <FormGroup
                title="名"
                titleType="subSubBlockTitle"
                errorMessages="名が入力されていません。"
                htmlFor="form_8"
              >
                <Input name="firstName" id="form_8" />
              </FormGroup>
            </Cluster>
          </FormGroup>
        </dd>
      </Stack>
    </Stack>
  )
}
All.storyName = 'all'
