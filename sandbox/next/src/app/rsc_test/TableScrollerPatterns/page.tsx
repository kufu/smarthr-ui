import React from 'react'
import { Table } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker'

const Row = () => (
  <tbody>
    <tr>
      <td>cell</td>
    </tr>
  </tbody>
)

export default function TableScrollerPatternsPage() {
  return (
    <>
      <RSCChecker actualComponent={Table} />
      <h2>reel=true, fixedHead=false (TableReel -&gt; ScrollerSwitcher -&gt; Scroller)</h2>
      <Table reel={true} fixedHead={false}>
        <Row />
      </Table>
      <h2>reel=true, fixedHead=true (TableReel -&gt; ScrollerSwitcher -&gt; FixedHeadTableScroller)</h2>
      <Table reel={true} fixedHead={true}>
        <Row />
      </Table>
      <h2>reel=false, fixedHead=false (TableScroller -&gt; ScrollerSwitcher -&gt; Scroller)</h2>
      <Table reel={false} fixedHead={false}>
        <Row />
      </Table>
      <h2>
        reel=false, fixedHead=true (TableScroller -&gt; ScrollerSwitcher -&gt; FixedHeadTableScroller)
      </h2>
      <Table reel={false} fixedHead={true}>
        <Row />
      </Table>
    </>
  )
}
