import { storiesOf } from '@storybook/react'
import * as React from 'react'

import Table from './Table'
import Body from './Body'
import Head from './Head'
import Row from './Row'
import Cell from './Cell'

class TableSampleData {
  readonly employeeNumber: string
  readonly name: string
  readonly permission: string
  readonly employmentType: string
  readonly role: string
  readonly team: string

  constructor(
    _employeeNumber: string,
    _name: string,
    _permission: string,
    _employmentType: string,
    _role: string,
    _team: string,
  ) {
    this.employeeNumber = _employeeNumber
    this.name = _name
    this.permission = _permission
    this.employmentType = _employmentType
    this.role = _role
    this.team = _team
  }
}

const tableSampleDataSet = [
  new TableSampleData('01', '佐藤 一郎', '', '正社員', 'メンバー', 'デザイン'),
  new TableSampleData('02', '鈴木 二郎', '', '正社員', 'メンバー', 'エンジニア'),
]

storiesOf('Table', module).add('all', () => (
  <Table size="l" disabled>
    <Head>
      <Row>
        <Cell>社員番号</Cell>
        <Cell>権限</Cell>
        <Cell>雇用形態</Cell>
        <Cell>役職</Cell>
        <Cell>部署</Cell>
      </Row>
    </Head>
    <Body>
      {tableSampleDataSet.map(member => (
        <Row key={member.employeeNumber}>
          <Cell>{member.employeeNumber}</Cell>
          <Cell>{member.role}</Cell>
          <Cell>{member.employmentType}</Cell>
          <Cell>{member.role}</Cell>
          <Cell>{member.team}</Cell>
        </Row>
      ))}
    </Body>
  </Table>
))
