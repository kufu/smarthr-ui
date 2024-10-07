import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { backgroundColor } from '../../../themes'
import { Button } from '../../Button'
import { Heading } from '../../Heading'
import { FaPenIcon } from '../../Icon'
import { StatusLabel } from '../../StatusLabel'
import { TabBar, TabItem } from '../../TabBar'
import { Table, Td, Th } from '../../Table'
import { Stack } from '../Stack'

import { Reel } from '.'

export default {
  title: 'Layouts（レイアウト）/Reel',
  component: Reel,
  parameters: {
    viewport: {
      defaultViewport: 'iphone6',
    },
  },
}

export const All: StoryFn = () => {
  const [currentTab, setCurrentTab] = React.useState(0)

  return (
    <Stack as="article" gap="M" style={{ padding: '20px' }}>
      <header>
        {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
        <Heading>Reel</Heading>
      </header>
      <Stack as="section">
        {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
        <Heading type="sectionTitle">
          with <code>gap</code>, <code>padding</code>
        </Heading>
        <Reel padding="S" gap="S" style={{ backgroundColor: backgroundColor.background }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, i) => (
            <Box key={i} style={{ backgroundColor: backgroundColor.main }}>
              Item
            </Box>
          ))}
        </Reel>
      </Stack>
      <Stack as="section">
        {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
        <Heading type="sectionTitle">
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
        {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
        <Heading type="sectionTitle">
          <code>Table</code>
        </Heading>
        <Reel>
          <Table>
            <thead>
              <tr>
                <Th>社員番号</Th>
                <Th>ステータス</Th>
                <Th>姓</Th>
                <Th>名</Th>
                <Th>姓（カタカナ）</Th>
                <Th>名（カタカナ）</Th>
                <Th>生年月日</Th>
                <Th>操作</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Th>000111</Th>
                <Td>
                  <StatusLabel type="blue">入社手続き中</StatusLabel>
                </Td>
                <Td>草野</Td>
                <Td>栄一郎</Td>
                <Td>クサノ</Td>
                <Td>エイイチロウ</Td>
                <Td>
                  <time dateTime="1971-03-01">1971/03/01</time>
                </Td>
                <Td>
                  <Button prefix={<FaPenIcon />} size="s">
                    編集
                  </Button>
                </Td>
              </tr>
              <tr>
                <Th>000110</Th>
                <Td>
                  <StatusLabel>在籍</StatusLabel>
                </Td>
                <Td>岩下</Td>
                <Td>香澄</Td>
                <Td>イワシタ</Td>
                <Td>カスミ</Td>
                <Td>
                  <time dateTime="1985-01-01">1985/01/01</time>
                </Td>
                <Td>
                  <Button prefix={<FaPenIcon />} size="s">
                    編集
                  </Button>
                </Td>
              </tr>
              <tr>
                <Th>000109</Th>
                <Td>
                  <StatusLabel>在籍</StatusLabel>
                </Td>
                <Td>島袋</Td>
                <Td>月代</Td>
                <Td>シマブクロ</Td>
                <Td>ツキヨ</Td>
                <Td>
                  <time dateTime="1980-01-01">1980/01/01</time>
                </Td>
                <Td>
                  <Button prefix={<FaPenIcon />} size="s">
                    編集
                  </Button>
                </Td>
              </tr>
              <tr>
                <Th>000108</Th>
                <Td>
                  <StatusLabel>在籍</StatusLabel>
                </Td>
                <Td>永山</Td>
                <Td>侑太郎</Td>
                <Td>ナガヤマ</Td>
                <Td>ユウタロウ</Td>
                <Td>
                  <time dateTime="1971-03-01">1984/04/04</time>
                </Td>
                <Td>
                  <Button prefix={<FaPenIcon />} size="s">
                    編集
                  </Button>
                </Td>
              </tr>
              <tr>
                <Th>000107</Th>
                <Td>
                  <StatusLabel>在籍</StatusLabel>
                </Td>
                <Td>上原</Td>
                <Td>玲子</Td>
                <Td>ウエハラ</Td>
                <Td>レイコ</Td>
                <Td>
                  <time dateTime="1985-05-05">1985/05/05</time>
                </Td>
                <Td>
                  <Button prefix={<FaPenIcon />} size="s">
                    編集
                  </Button>
                </Td>
              </tr>
              <tr>
                <Th>000106</Th>
                <Td>
                  <StatusLabel>在籍</StatusLabel>
                </Td>
                <Td>Robert</Td>
                <Td>Smith</Td>
                <Td>ロバート</Td>
                <Td>スミス</Td>
                <Td>
                  <time dateTime="1986-06-06">1986/06/06</time>
                </Td>
                <Td>
                  <Button prefix={<FaPenIcon />} size="s">
                    編集
                  </Button>
                </Td>
              </tr>
              <tr>
                <Th>000105</Th>
                <Td>
                  <StatusLabel>在籍</StatusLabel>
                </Td>
                <Td>大和</Td>
                <Td>真</Td>
                <Td>ヤマト</Td>
                <Td>マコト</Td>
                <Td>
                  <time dateTime="1991-08-17">1991/08/17</time>
                </Td>
                <Td>
                  <Button prefix={<FaPenIcon />} size="s">
                    編集
                  </Button>
                </Td>
              </tr>
              <tr>
                <Th>000104</Th>
                <Td>
                  <StatusLabel>在籍</StatusLabel>
                </Td>
                <Td>松原</Td>
                <Td>英太</Td>
                <Td>マツバラ</Td>
                <Td>エイタ</Td>
                <Td>
                  <time dateTime="1990-04-01">1990/04/01</time>
                </Td>
                <Td>
                  <Button prefix={<FaPenIcon />} size="s">
                    編集
                  </Button>
                </Td>
              </tr>
              <tr>
                <Th>000103</Th>
                <Td>
                  <StatusLabel>在籍</StatusLabel>
                </Td>
                <Td>阿久津</Td>
                <Td>雄一</Td>
                <Td>アクツ</Td>
                <Td>ユウイチ</Td>
                <Td>
                  <time dateTime="1980-05-21">1980/05/21</time>
                </Td>
                <Td>
                  <Button prefix={<FaPenIcon />} size="s">
                    編集
                  </Button>
                </Td>
              </tr>
              <tr>
                <Th>000102</Th>
                <Td>
                  <StatusLabel type="red">退職</StatusLabel>
                </Td>
                <Td>高美</Td>
                <Td>ひなこ</Td>
                <Td>タカミ</Td>
                <Td>ヒナコ</Td>
                <Td>
                  <time dateTime="1977-05-22">1977/05/22</time>
                </Td>
                <Td>
                  <Button prefix={<FaPenIcon />} size="s">
                    編集
                  </Button>
                </Td>
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
