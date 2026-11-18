import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { TableView } from './TableView'

import type { ChartData, ChartOptions } from 'chart.js'

const data: ChartData<'bar'> = {
  labels: ['項目A', '項目B', '項目C', '項目D'],
  datasets: [
    { label: '項目Aの内訳1', stack: '項目A', data: [12, null, null, null] },
    { label: '項目Aの内訳2', stack: '項目A', data: [19, null, null, null] },
    { label: '項目Aの内訳3', stack: '項目A', data: [3, null, null, null] },
    { label: '項目Bの内訳1', stack: '項目B', data: [null, 0, null, null] },
    { label: '項目Cの内訳1', stack: '項目C', data: [null, null, 8, null] },
    { label: '項目Cの内訳2', stack: '項目C', data: [null, null, 11, null] },
  ],
}

const options: ChartOptions<'bar'> = {
  indexAxis: 'y',
  scales: {
    x: { title: { text: '値' } },
    y: { title: { text: 'カテゴリ' } },
  },
  plugins: { legend: { title: { text: '内訳' } } },
}

const renderTable = (props: Parameters<typeof TableView<'bar'>>[0]) => {
  document.body.innerHTML = renderToStaticMarkup(<TableView<'bar'> {...props} />)
  return document.querySelector('table')!
}

const textOf = (el: Element) => el.textContent?.trim()

describe('TableView', () => {
  describe('grouped', () => {
    it('列見出しはカテゴリ軸・凡例・値軸のタイトルから設定する', () => {
      const table = renderTable({ data, options, grouped: true })
      const headers = Array.from(table.querySelectorAll('thead th'))

      expect(headers.map(textOf)).toEqual(['カテゴリ', '内訳', '値'])
      headers.forEach((th) => expect(th.getAttribute('scope')).toBe('col'))
    })

    it('タイトルを設定していない場合は既定の列見出しを表示する', () => {
      const table = renderTable({ data, options: {}, grouped: true })

      expect(Array.from(table.querySelectorAll('thead th')).map(textOf)).toEqual([
        'グループ',
        'カテゴリー',
        '値',
      ])
    })

    it('カテゴリごとにtbodyを分け、カテゴリ名は先頭行に1回だけrowSpanで表示する（値のないカテゴリは出さない）', () => {
      const table = renderTable({ data, options, grouped: true })
      const bodies = Array.from(table.querySelectorAll('tbody'))

      expect(bodies).toHaveLength(3)
      expect(
        bodies.map((tbody) => {
          const category = tbody.querySelectorAll('th[scope="rowgroup"]')

          return {
            rows: tbody.querySelectorAll('tr').length,
            categories: Array.from(category).map(textOf),
            rowSpan: category[0].getAttribute('rowspan'),
          }
        }),
      ).toEqual([
        { rows: 3, categories: ['項目A'], rowSpan: '3' },
        { rows: 1, categories: ['項目B'], rowSpan: '1' },
        { rows: 2, categories: ['項目C'], rowSpan: '2' },
      ])
    })

    it('内訳ごとに1行を表示し、0も省略しない', () => {
      const table = renderTable({ data, options, grouped: true })
      const rows = Array.from(table.querySelectorAll('tbody tr')).map((tr) => [
        textOf(tr.querySelector('th[scope="row"]')!),
        textOf(tr.querySelector('td')!),
      ])

      expect(rows).toEqual([
        ['項目Aの内訳1', '12'],
        ['項目Aの内訳2', '19'],
        ['項目Aの内訳3', '3'],
        ['項目Bの内訳1', '0'],
        ['項目Cの内訳1', '8'],
        ['項目Cの内訳2', '11'],
      ])
    })

    it('縦向きのときはx軸をカテゴリ、y軸を値の見出しにする', () => {
      const table = renderTable({
        data,
        options: {
          ...options,
          indexAxis: 'x',
          scales: { x: { title: { text: '軸X' } }, y: { title: { text: '軸Y' } } },
        },
        grouped: true,
      })

      expect(Array.from(table.querySelectorAll('thead th')).map(textOf)).toEqual([
        '軸X',
        '内訳',
        '軸Y',
      ])
    })
  })
})
