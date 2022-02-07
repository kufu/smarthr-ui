import { Story } from '@storybook/react'
import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import {
  Base as BaseComponent,
  Body,
  Cell,
  FaEditIcon,
  FaPlusCircleIcon,
  FaSearchIcon,
  FaTrashAltIcon,
  Head,
  Heading,
  InformationPanel,
  Input,
  LineUp,
  Pagination,
  Row,
  SecondaryButton,
  Stack,
  Table,
  Text,
  ThemeProvider,
} from '../..'
import { Footer, Header, SpinnerRow } from '../components/'
import { GlobalStyle, LayoutProvider, smarthrUITheme } from '../styles/theme'

import { dummyPosts } from '../data/dummyPosts'

export default {
  title: 'Pages/Collection',
}

export const Default: Story = () => {
  const [posts, setPosts] = useState([])
  const [isFetching, setIsFetching] = useState<boolean>(false)

  useEffect(() => {
    setIsFetching(true)
    setPosts(dummyPosts)
    setIsFetching(false)
  }, [])

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={smarthrUITheme}>
        <LayoutProvider>
          <Header />
          <Content fullWidth={true} zIndex={0}>
            <Stack gap={1.5}>
              <Stack>
                <Heading tag="h1">ページタイトル</Heading>
                <p>ページの説明が入ります。</p>
              </Stack>
              <Stack>
                <InformationPanel title={'インフォメーション'}>
                  <Stack>
                    <p>インフォメーション情報が入ります。</p>
                  </Stack>
                </InformationPanel>
              </Stack>
              <Stack>
                <Stack>
                  <LineUp align="space-between" vAlign="center">
                    <Heading type="sectionTitle" tag="h2">
                      コレクションタイトル
                    </Heading>
                    <SecondaryButton prefix={<FaPlusCircleIcon />}>
                      オブジェクトを追加
                    </SecondaryButton>
                  </LineUp>
                </Stack>
                <Stack>
                  <Base>
                    <TableHeadNavigation>
                      <LineUp align="space-between" vAlign="center">
                        <LineUp gap={0.5}>
                          <Input prefix={<FaSearchIcon />} />
                          <SecondaryButton>検索</SecondaryButton>
                        </LineUp>
                        <LineUp gap={1} vAlign="center">
                          <Text>
                            <strong>152</strong> 件中<strong>1 - 50</strong> 件を表示中
                          </Text>
                          <Pagination
                            current={7}
                            total={13}
                            withoutNumbers={true}
                            onClick={(number) => {
                              console.log(number)
                            }}
                          />
                        </LineUp>
                      </LineUp>
                    </TableHeadNavigation>
                    <TableWrapper>
                      <Table>
                        <Head>
                          <Row>
                            <Cell>ID</Cell>
                            <Cell>名前</Cell>
                            <Cell>メールアドレス</Cell>
                            <Cell>会社名</Cell>
                            <Cell>操作</Cell>
                          </Row>
                        </Head>
                        <Body>
                          {isFetching ? (
                            <SpinnerRow colSpan={5} />
                          ) : (
                            posts.map((post: any, index: number) => {
                              return (
                                <Row key={index}>
                                  <Cell>{post.id}</Cell>
                                  <Cell>{post.name}</Cell>
                                  <Cell>{post.email}</Cell>
                                  <Cell>{post.company.name}</Cell>
                                  <Cell>
                                    <LineUp vAlign="center" gap={0.5}>
                                      <SecondaryButton size="s" prefix={<FaEditIcon />}>
                                        編集
                                      </SecondaryButton>
                                      <SecondaryButton size="s" prefix={<FaTrashAltIcon />}>
                                        削除
                                      </SecondaryButton>
                                    </LineUp>
                                  </Cell>
                                </Row>
                              )
                            })
                          )}
                        </Body>
                      </Table>
                    </TableWrapper>
                  </Base>
                </Stack>
                <Stack align={'center'}>
                  <Pagination
                    current={7}
                    total={13}
                    onClick={(number) => {
                      console.log(number)
                    }}
                  />
                </Stack>
              </Stack>
            </Stack>
          </Content>
          <Footer />
        </LayoutProvider>
      </ThemeProvider>
    </>
  )
}

const Div = styled.div<{ zIndex: number }>(
  ({ zIndex }) => css`
    position: relative;
    z-index: ${zIndex};
  `,
)

const Content = styled(Div)<{ fullWidth: boolean }>(
  ({ fullWidth, theme: { space, width } }) => css`
    margin-right: auto;
    margin-left: auto;
    padding: ${space(2)} ${space(1.5)};
    max-width: ${fullWidth ? 'none' : width.CONTENT.MAIN};
    @media (min-width: ${width.CONTENT.MAIN}) {
      padding-right: ${space(2)};
      padding-left: ${space(2)};
    }
  `,
)

const Base = styled(BaseComponent)(
  ({ theme: { radius } }) => css`
    border-radius: ${radius.m};
    overflow: hidden;
  `,
)

const TableWrapper = styled.div`
  overflow-x: scroll;
`

const TableHeadNavigation = styled('nav')(
  ({ theme: { space } }) => css`
    padding: ${space(1)} ${space(1.5)};
  `,
)
