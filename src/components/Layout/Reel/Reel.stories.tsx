import React from 'react'
import styled from 'styled-components'
import { Story } from '@storybook/react'

import { Reel } from '.'
import { Stack } from '../Stack'
import { TabBar, TabItem } from '../../TabBar'
import { Table } from '../../Table'
import { SecondaryButton } from '../../Button'
import { FaPenIcon } from '../../Icon'
import { StatusLabel } from '../../StatusLabel'
import { Heading } from '../../Heading'
import { useTheme } from '../../../hooks/useTheme'

export const ReelStory: Story = () => {
  const [currentTab, setCurrentTab] = React.useState(0)
  const theme = useTheme()

  return (
    <Stack as="article" gap="M" style={{ padding: '20px' }}>
      <header>
        <Heading>Reel</Heading>
      </header>
      <Stack as="section">
        <Heading tag="h2" type="sectionTitle">
          with <code>gap</code>, <code>padding</code>
        </Heading>
        <Reel padding="S" gap="S" style={{ backgroundColor: theme.color.BACKGROUND }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, i) => (
            <Box key={i} style={{ backgroundColor: theme.color.MAIN }}>
              Item
            </Box>
          ))}
        </Reel>
      </Stack>
      <Stack as="section">
        <Heading tag="h2" type="sectionTitle">
          <code>TabBar</code>
        </Heading>
        <Reel>
          <TabBar>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, i) => (
              <TabItem
                key={i}
                id={`${i}`}
                selected={currentTab === i}
                onClick={(__) => setCurrentTab(i)}
              >
                Tab{i}
              </TabItem>
            ))}
          </TabBar>
        </Reel>
      </Stack>
      <Stack as="section">
        <Heading tag="h2" type="sectionTitle">
          <code>Table</code>
        </Heading>
        <Reel>
          <Table>
            <thead>
              <tr>
                <th>社員番号</th>
                <th>ステータス</th>
                <th>姓</th>
                <th>名</th>
                <th>姓（カタカナ）</th>
                <th>名（カタカナ）</th>
                <th>生年月日</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>000111</th>
                <td>
                  <StatusLabel type="process">入社手続き中</StatusLabel>
                </td>
                <td>草野</td>
                <td>栄一郎</td>
                <td>クサノ</td>
                <td>エイイチロウ</td>
                <td>
                  <time dateTime="1971-03-01">1971/03/01</time>
                </td>
                <td>
                  <SecondaryButton prefix={<FaPenIcon />} size="s">
                    編集
                  </SecondaryButton>
                </td>
              </tr>
              <tr>
                <th>000110</th>
                <td>
                  <StatusLabel type="done">在籍</StatusLabel>
                </td>
                <td>岩下</td>
                <td>香澄</td>
                <td>イワシタ</td>
                <td>カスミ</td>
                <td>
                  <time dateTime="1985-01-01">1985/01/01</time>
                </td>
                <td>
                  <SecondaryButton prefix={<FaPenIcon />} size="s">
                    編集
                  </SecondaryButton>
                </td>
              </tr>
              <tr>
                <th>000109</th>
                <td>
                  <StatusLabel type="done">在籍</StatusLabel>
                </td>
                <td>島袋</td>
                <td>月代</td>
                <td>シマブクロ</td>
                <td>ツキヨ</td>
                <td>
                  <time dateTime="1980-01-01">1980/01/01</time>
                </td>
                <td>
                  <SecondaryButton prefix={<FaPenIcon />} size="s">
                    編集
                  </SecondaryButton>
                </td>
              </tr>
              <tr>
                <th>000108</th>
                <td>
                  <StatusLabel type="done">在籍</StatusLabel>
                </td>
                <td>永山</td>
                <td>侑太郎</td>
                <td>ナガヤマ</td>
                <td>ユウタロウ</td>
                <td>
                  <time dateTime="1971-03-01">1984/04/04</time>
                </td>
                <td>
                  <SecondaryButton prefix={<FaPenIcon />} size="s">
                    編集
                  </SecondaryButton>
                </td>
              </tr>
              <tr>
                <th>000107</th>
                <td>
                  <StatusLabel type="done">在籍</StatusLabel>
                </td>
                <td>上原</td>
                <td>玲子</td>
                <td>ウエハラ</td>
                <td>レイコ</td>
                <td>
                  <time dateTime="1985-05-05">1985/05/05</time>
                </td>
                <td>
                  <SecondaryButton prefix={<FaPenIcon />} size="s">
                    編集
                  </SecondaryButton>
                </td>
              </tr>
              <tr>
                <th>000106</th>
                <td>
                  <StatusLabel type="done">在籍</StatusLabel>
                </td>
                <td>Robert</td>
                <td>Smith</td>
                <td>ロバート</td>
                <td>スミス</td>
                <td>
                  <time dateTime="1986-06-06">1986/06/06</time>
                </td>
                <td>
                  <SecondaryButton prefix={<FaPenIcon />} size="s">
                    編集
                  </SecondaryButton>
                </td>
              </tr>
              <tr>
                <th>000105</th>
                <td>
                  <StatusLabel type="done">在籍</StatusLabel>
                </td>
                <td>大和</td>
                <td>真</td>
                <td>ヤマト</td>
                <td>マコト</td>
                <td>
                  <time dateTime="1991-08-17">1991/08/17</time>
                </td>
                <td>
                  <SecondaryButton prefix={<FaPenIcon />} size="s">
                    編集
                  </SecondaryButton>
                </td>
              </tr>
              <tr>
                <th>000104</th>
                <td>
                  <StatusLabel type="done">在籍</StatusLabel>
                </td>
                <td>松原</td>
                <td>英太</td>
                <td>マツバラ</td>
                <td>エイタ</td>
                <td>
                  <time dateTime="1990-04-01">1990/04/01</time>
                </td>
                <td>
                  <SecondaryButton prefix={<FaPenIcon />} size="s">
                    編集
                  </SecondaryButton>
                </td>
              </tr>
              <tr>
                <th>000103</th>
                <td>
                  <StatusLabel type="done">在籍</StatusLabel>
                </td>
                <td>阿久津</td>
                <td>雄一</td>
                <td>アクツ</td>
                <td>ユウイチ</td>
                <td>
                  <time dateTime="1980-05-21">1980/05/21</time>
                </td>
                <td>
                  <SecondaryButton prefix={<FaPenIcon />} size="s">
                    編集
                  </SecondaryButton>
                </td>
              </tr>
              <tr>
                <th>000102</th>
                <td>
                  <StatusLabel type="done">退職</StatusLabel>
                </td>
                <td>高美</td>
                <td>ひなこ</td>
                <td>タカミ</td>
                <td>ヒナコ</td>
                <td>
                  <time dateTime="1977-05-22">1977/05/22</time>
                </td>
                <td>
                  <SecondaryButton prefix={<FaPenIcon />} size="s">
                    編集
                  </SecondaryButton>
                </td>
              </tr>
            </tbody>
          </Table>
        </Reel>
      </Stack>
    </Stack>
  )
}

const Box = styled.div`
  display: grid;
  place-items: center;
  width: 300px;
  height: 300px;
  color: white;
`

ReelStory.parameters = {
  viewport: {
    defaultViewport: 'iphone6',
  },
}
