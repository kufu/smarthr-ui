import React from 'react'
import styled from 'styled-components'
import { Story } from '@storybook/react'

import readme from './README.md'

import { RadioButton } from './RadioButton'
import { Cluster, LineUp, Stack } from '../Layout'
import { FaExclamationCircleIcon } from '../Icon'
import { Text } from '../Text'
import { Heading } from '../Heading'
import { Base } from '../Base'
import { useTheme } from '../..'

export default {
  title: 'RadioButton',
  component: RadioButton,
  parameters: {
    readme: {
      sidebar: readme,
    },
  },
}

export const Overview: Story = () => {
  const theme = useTheme()

  return (
    <ContainerStack gap="L">
      <Heading type="screenTitle">RadioButton Overview</Heading>
      <Stack as="section" gap="XXS">
        <Heading type="sectionTitle" tag="h2">
          RadioButton
        </Heading>
        <Base style={{ padding: theme.spacing.M }}>
          <Stack>
            <p>RadioButtonは複数ある選択肢から1つだけ選ばせたいときに利用します。</p>
            <p>
              選択肢がすべて表示されているので、候補の把握が容易です。スペースを節約したい場合は
              <code>&lt;Select&gt;</code>の利用を検討してください。
            </p>
            <p>
              複数ある選択肢のグループは同じ<code>name</code>
              属性を持ちます。グループの名前が明確な場合は、<code>fieldset</code>要素や
              <code>role=&quot;group&quot;</code>でグルーピングしてもよいでしょう。
            </p>
            <fieldset style={{ border: 0, padding: 0 }}>
              <legend>
                <Text weight="bold">ラジオグループ</Text>
              </legend>
              <RadioCluster
                as="ul"
                role="list"
                gap={{ row: 'XS', column: 'M' }}
                align="center"
                style={{ background: theme.color.BACKGROUND }}
              >
                <li>
                  <RadioButton name="1">ラジオボタン1</RadioButton>
                </li>
                <li>
                  <RadioButton name="1">ラジオボタン2</RadioButton>
                </li>
                <li>
                  <RadioButton name="1">ラジオボタン3</RadioButton>
                </li>
              </RadioCluster>
            </fieldset>
          </Stack>
        </Base>
      </Stack>

      <Stack as="section" gap="XXS">
        <Heading type="sectionTitle" tag="h2">
          ラベルの無いRadioButton
        </Heading>
        <Base style={{ padding: theme.spacing.M }}>
          <Stack>
            <p>
              <LineUp gap="X3S" vAlign="center" as="strong">
                <FaExclamationCircleIcon color="DANGER" style={{ flexShrink: 0 }} />
                <span>原則、ラベルの無いラジオボタンは利用しないでください。</span>
              </LineUp>
            </p>
            <p>
              やむなく使用する場合は、<code>label</code>要素や<code>aria-label</code>
              などを用いてラベルと関連付けてください。
            </p>
            <RadioCluster as="ul" role="list" gap={{ row: 'XS', column: 'M' }} align="center">
              <LineUp as="li" vAlign="center">
                <RadioButton name="2" defaultChecked={true} id="without_children_radio_1_heading" />
                <LabelCardBase>
                  <Stack>
                    <Heading type="subSubBlockTitle" tag="h3">
                      <label htmlFor="without_children_radio_1_heading">
                        ラベルの無いラジオボタン1
                      </label>
                    </Heading>
                    <Text size="S">
                      近接するテキストを<code>label</code>要素でマークアップし、
                      <code>for</code>属性で関連付けてください。
                    </Text>
                  </Stack>
                </LabelCardBase>
              </LineUp>
              <LineUp as="li" vAlign="center">
                <RadioButton name="2" defaultChecked={true} id="without_children_radio_2_heading" />
                <LabelCardBase>
                  <Stack>
                    <Heading type="subSubBlockTitle" tag="h3">
                      <label htmlFor="without_children_radio_2_heading">
                        ラベルの無いラジオボタン2
                      </label>
                    </Heading>
                    <Text size="S">
                      必要最小限のタイトルのみ関連付け、クリック可能な領域を広げる工夫をしてください。
                    </Text>
                  </Stack>
                </LabelCardBase>
              </LineUp>
            </RadioCluster>
          </Stack>
        </Base>
      </Stack>

      <Stack as="section" gap="XXS">
        <Heading type="sectionTitle" tag="h2">
          長いラベルやカスタムラベル
        </Heading>
        <Base style={{ padding: theme.spacing.M }}>
          <RadioCluster
            as="ul"
            role="list"
            gap={{ row: 'XS', column: 'M' }}
            align="center"
            style={{ maxWidth: '40em' }}
          >
            <li>
              <RadioButton name="3">
                2行に渡る長いラベルも許容しています。ただし、ユーザーが短い時間で理解できるようできるかぎり短い選択肢を用意しましょう。
              </RadioButton>
            </li>
            <li>
              <RadioButton name="3">
                <Text size="L" weight="bold" leading="TIGHT" style={{ display: 'block' }}>
                  カスタムラベル
                </Text>
                <Text size="S">
                  テキストではなくカスタムされたスタイルを持つラベルも提供できます。
                </Text>
              </RadioButton>
            </li>
          </RadioCluster>
        </Base>
      </Stack>
    </ContainerStack>
  )
}
Overview.parameters = {
  backgrounds: { default: 'light' },
}

export const AllState: Story = () => (
  <ul>
    <li>
      <RadioButton>default</RadioButton>
    </li>
    <li>
      <RadioButton checked>checked</RadioButton>
    </li>
    <li>
      <RadioButton defaultChecked>defaultChecked</RadioButton>
    </li>
    <li>
      <RadioButton disabled>disabled</RadioButton>
    </li>
    <li>
      <RadioButton checked disabled>
        checked &amp; disabled
      </RadioButton>
    </li>
    <li>
      <RadioButton defaultChecked disabled>
        defaultChecked &amp; disabled
      </RadioButton>
    </li>
  </ul>
)

const RadioCluster = styled(Cluster)`
  list-style: none;
  margin: 0;
  padding: 16px;
`

const LabelCardBase = styled(Base)`
  padding: 1rem;
  max-width: 12rem;
  position: relative;

  & label::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: auto;
    height: auto;
    cursor: pointer;
  }
`

const ContainerStack = styled(Stack)`
  width: 90%;
  max-width: calc(40rem + 64px);
  margin: 32px auto;
`
