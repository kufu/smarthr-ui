import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Icon, Props } from './Icon'

const Wrapper = ({ children }: any) => <Container>{children}</Container>
const black = '#222'
const white = '#eee'
const icons: Array<Props['name']> = ['check', 'check-circle', 'cross', 'exclamation-triangle']

const getIconList = (bg: string, fill?: string) =>
  icons.map(name => (
    <IconWrap key={`${fill}-${name}`} bg={bg}>
      <Icon name={name} fill={fill} />
      <IconName color={fill}>{name}</IconName>
    </IconWrap>
  ))

storiesOf('Icon', module)
  .add('white', () => <Wrapper>{getIconList(black, white)}</Wrapper>)
  .add('black', () => <Wrapper>{getIconList(white, black)}</Wrapper>)
  .add('default', () => <Wrapper>{getIconList(white)}</Wrapper>)

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
