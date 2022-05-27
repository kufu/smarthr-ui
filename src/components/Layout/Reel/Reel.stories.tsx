import React from 'react'
import styled from 'styled-components'
import { Story } from '@storybook/react'

import { Reel } from '.'
import { Stack } from '../Stack'
import { TabBar, TabItem } from '../../TabBar'
import { Body, Cell, Head, Row, Table } from '../../Table'
import { Button } from '../../Button'
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
            <Head>
              <Row>
                <Cell>社員番号</Cell>
                <Cell>ステータス</Cell>
                <Cell>姓</Cell>
                <Cell>名</Cell>
                <Cell>姓（カタカナ）</Cell>
                <Cell>名（カタカナ）</Cell>
                <Cell>生年月日</Cell>
                <Cell>操作</Cell>
              </Row>
            </Head>
            <Body>
              <Row>
                <th>000111</th>
                <Cell>
                  <StatusLabel type="process">入社手続き中</StatusLabel>
                </Cell>
                <Cell>草野</Cell>
                <Cell>栄一郎</Cell>
                <Cell>クサノ</Cell>
                <Cell>エイイチロウ</Cell>
                <Cell>
                  <time dateTime="1971-03-01">1971/03/01</time>
                </Cell>
                <Cell>
                  <Button prefix={<FaPenIcon />} size="s">
                    編集
                  </Button>
                </Cell>
              </Row>
              <Row>
                <th>000110</th>
                <Cell>
                  <StatusLabel type="done">在籍</StatusLabel>
                </Cell>
                <Cell>岩下</Cell>
                <Cell>香澄</Cell>
                <Cell>イワシタ</Cell>
                <Cell>カスミ</Cell>
                <Cell>
                  <time dateTime="1985-01-01">1985/01/01</time>
                </Cell>
                <Cell>
                  <Button prefix={<FaPenIcon />} size="s">
                    編集
                  </Button>
                </Cell>
              </Row>
              <Row>
                <th>000109</th>
                <Cell>
                  <StatusLabel type="done">在籍</StatusLabel>
                </Cell>
                <Cell>島袋</Cell>
                <Cell>月代</Cell>
                <Cell>シマブクロ</Cell>
                <Cell>ツキヨ</Cell>
                <Cell>
                  <time dateTime="1980-01-01">1980/01/01</time>
                </Cell>
                <Cell>
                  <Button prefix={<FaPenIcon />} size="s">
                    編集
                  </Button>
                </Cell>
              </Row>
              <Row>
                <th>000108</th>
                <Cell>
                  <StatusLabel type="done">在籍</StatusLabel>
                </Cell>
                <Cell>永山</Cell>
                <Cell>侑太郎</Cell>
                <Cell>ナガヤマ</Cell>
                <Cell>ユウタロウ</Cell>
                <Cell>
                  <time dateTime="1971-03-01">1984/04/04</time>
                </Cell>
                <Cell>
                  <Button prefix={<FaPenIcon />} size="s">
                    編集
                  </Button>
                </Cell>
              </Row>
              <Row>
                <th>000107</th>
                <Cell>
                  <StatusLabel type="done">在籍</StatusLabel>
                </Cell>
                <Cell>上原</Cell>
                <Cell>玲子</Cell>
                <Cell>ウエハラ</Cell>
                <Cell>レイコ</Cell>
                <Cell>
                  <time dateTime="1985-05-05">1985/05/05</time>
                </Cell>
                <Cell>
                  <Button prefix={<FaPenIcon />} size="s">
                    編集
                  </Button>
                </Cell>
              </Row>
              <Row>
                <th>000106</th>
                <Cell>
                  <StatusLabel type="done">在籍</StatusLabel>
                </Cell>
                <Cell>Robert</Cell>
                <Cell>Smith</Cell>
                <Cell>ロバート</Cell>
                <Cell>スミス</Cell>
                <Cell>
                  <time dateTime="1986-06-06">1986/06/06</time>
                </Cell>
                <Cell>
                  <Button prefix={<FaPenIcon />} size="s">
                    編集
                  </Button>
                </Cell>
              </Row>
              <Row>
                <th>000105</th>
                <Cell>
                  <StatusLabel type="done">在籍</StatusLabel>
                </Cell>
                <Cell>大和</Cell>
                <Cell>真</Cell>
                <Cell>ヤマト</Cell>
                <Cell>マコト</Cell>
                <Cell>
                  <time dateTime="1991-08-17">1991/08/17</time>
                </Cell>
                <Cell>
                  <Button prefix={<FaPenIcon />} size="s">
                    編集
                  </Button>
                </Cell>
              </Row>
              <Row>
                <th>000104</th>
                <Cell>
                  <StatusLabel type="done">在籍</StatusLabel>
                </Cell>
                <Cell>松原</Cell>
                <Cell>英太</Cell>
                <Cell>マツバラ</Cell>
                <Cell>エイタ</Cell>
                <Cell>
                  <time dateTime="1990-04-01">1990/04/01</time>
                </Cell>
                <Cell>
                  <Button prefix={<FaPenIcon />} size="s">
                    編集
                  </Button>
                </Cell>
              </Row>
              <Row>
                <th>000103</th>
                <Cell>
                  <StatusLabel type="done">在籍</StatusLabel>
                </Cell>
                <Cell>阿久津</Cell>
                <Cell>雄一</Cell>
                <Cell>アクツ</Cell>
                <Cell>ユウイチ</Cell>
                <Cell>
                  <time dateTime="1980-05-21">1980/05/21</time>
                </Cell>
                <Cell>
                  <Button prefix={<FaPenIcon />} size="s">
                    編集
                  </Button>
                </Cell>
              </Row>
              <Row>
                <th>000102</th>
                <Cell>
                  <StatusLabel type="done">退職</StatusLabel>
                </Cell>
                <Cell>高美</Cell>
                <Cell>ひなこ</Cell>
                <Cell>タカミ</Cell>
                <Cell>ヒナコ</Cell>
                <Cell>
                  <time dateTime="1977-05-22">1977/05/22</time>
                </Cell>
                <Cell>
                  <Button prefix={<FaPenIcon />} size="s">
                    編集
                  </Button>
                </Cell>
              </Row>
            </Body>
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
