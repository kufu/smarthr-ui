import { Story } from '@storybook/react'
import React from 'react'

import { Input } from '../Input'
import { Cluster, Stack } from '../Layout'
import { Text } from '../Text'

import { FormGroup } from './FormGroup'

export default {
  title: 'Forms（フォーム）/FormGroup',
  component: FormGroup,
  parameters: {
    withTheming: true,
  },
}

export const All: Story = () => {
  return (
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
            errorMessages={'氏名が入力されていません。'}
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
          <FormGroup
            title="姓名"
            statusLabelProps={{ type: 'grey', children: '任意' }}
            helpMessage="姓名を入力してください。"
            errorMessages="姓名が入力されていません。"
            role="group"
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
          </FormGroup>
        </dd>
      </Stack>
      <Stack>
        <Text italic color="TEXT_GREY" as="dt">
          読み取り専用
        </Text>
        <dd>
          <FormGroup title="姓名" role="group">
            <Cluster gap={1}>
              <FormGroup title="姓" titleType="subSubBlockTitle">
                <Input name="lastName" value="草野" readOnly />
              </FormGroup>
              <FormGroup title="名" titleType="subSubBlockTitle">
                <Input name="firstName" value="栄一郎" readOnly />
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
            title="フォームコントロール名"
            helpMessage="このフォームグループは disabled です。内包するフォームグループは個別に disabled してください。"
            errorMessages="すべてのフォームコントロールが disabled です。"
            disabled
          >
            <Cluster gap={1}>
              <FormGroup
                title="姓"
                titleType="subSubBlockTitle"
                errorMessages="姓が入力されていません。"
                disabled
              >
                <Input name="lastName" width="25em" />
              </FormGroup>
              <FormGroup
                title="名"
                titleType="subSubBlockTitle"
                errorMessages="名が入力されていません。"
                disabled
              >
                <Input name="firstName" width="25em" />
              </FormGroup>
            </Cluster>
          </FormGroup>
        </dd>
      </Stack>
    </Stack>
  )
}
All.storyName = 'all'
