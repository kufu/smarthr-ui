import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Icon, Props } from './Icon'

const Wrapper = ({ children }: any) => <Container>{children}</Container>
const black = '#222'
const white = '#eee'
const icons: Array<Props['name']> = ['check']

const getIconList = (fill: string, bg: string) =>
  icons.map(name => (
    <IconWrap key={`${fill}-${name}`} bg={bg}>
      <Icon name={name} fill={fill} />
      <IconName color={fill}>{name}</IconName>
    </IconWrap>
  ))

storiesOf('Icon', module)
  .add('white', () => <Wrapper>{getIconList(white, black)}</Wrapper>)
  .add('black', () => <Wrapper>{getIconList(black, white)}</Wrapper>)

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`
const IconWrap: any = styled.div`
  margin: 10px;
  padding: 10px;
  background-color: ${({ bg }: any) => bg};
  text-align: center;
`
const IconName = styled.p`
  margin-top: 10px;
  color: ${({ color }: any) => color};
  font-size: 14px;
`
