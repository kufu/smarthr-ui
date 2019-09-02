import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Icon, Props } from './Icon'

const Wrapper = ({ children }: any) => <Container>{children}</Container>
const black = '#222'
const white = '#eee'
const icons: Array<Props['name']> = [
  'check-circle',
  'cross',
  'exclamation-triangle',
  'fa-address-book',
  'fa-address-card',
  'fa-angle-double-down',
  'fa-angle-down',
  'fa-arrow-circle-down',
  'fa-arrow-down',
  'fa-birthday-cake',
  'fa-building',
  'fa-calendar-alt',
  'fa-caret-down',
  'fa-chart-area',
  'fa-chart-bar',
  'fa-chart-line',
  'fa-chart-pie',
  'fa-check',
  'fa-cog',
  'fa-databas',
  'fa-ellipsis-h',
  'fa-envelope',
  'fa-file',
  'fa-file-alt',
  'fa-file-archive',
  'fa-file-download',
  'fa-file-export',
  'fa-file-import',
  'fa-file-upload',
  'fa-filter',
  'fa-font',
  'fa-grip-vertical',
  'fa-lock',
  'fa-lock-open',
  'fa-pencil-alt',
  'fa-plus',
  'fa-plus-circle',
  'fa-question-circle',
  'fa-reg-calendar-check',
  'fa-reg-chart-bar',
  'fa-reg-image',
  'fa-search',
  'fa-sliders-h',
  'fa-sort',
  'fa-sync-alt',
  'fa-table',
  'fa-th-list',
  'fa-user-alt',
  'fa-user-circle',
  'fa-users',
]

const getIconList = (bg: string, color?: string) =>
  icons.map(name => (
    <IconWrap key={`${color}-${name}`} bg={bg}>
      <Icon name={name} color={color} />
      <IconName color={color}>{name}</IconName>
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
