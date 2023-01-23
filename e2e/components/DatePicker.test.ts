import { Selector } from 'testcafe'

const dayjs = require('dayjs')

const elementWithId = Selector((id) => document.getElementById(id))

fixture('DatePicker')
  .page(
    'http://localhost:6006/iframe.html?args=&id=forms（フォーム）-datepicker--all&viewMode=story',
  )
  .beforeEach(async (t) => {
    await t.maximizeWindow()
  })

test('カレンダーから日付が選択できること', async (t) => {
  const input = Selector('[data-test=datepicker-1]')
  await t
    .click(input)
    // コントロール下の Calendar コンポーネントで日付をクリック
    .click(
      elementWithId(await input.getAttribute('aria-controls'))
        .find('.smarthr-ui-CalendarTable-dataCell')
        .withText('3')
        .find('button'),
    )
    // 日付がテキストボックスに入る確認
    .expect(input.value)
    .eql(dayjs().date(3).format('YYYY/MM/DD'))
    // 選択後はカレンダーが閉じる確認
    .expect(elementWithId(await input.getAttribute('aria-controls')).exists)
    .notOk()
})

test('フォーカスを失う時にテキストボックスの内容がフォーマットされること', async (t) => {
  const input = Selector('[data-test=datepicker-1]')
  await t
    .typeText(input, '令和2年11月29日')
    .click('body')
    .expect(input.value)
    .eql(dayjs('2020/11/29').format('YYYY/MM/DD'))
})

test('テキストボックスフォーカス後に Tab キーを押すとカレンダー内の年選択ボタンがフォーカスされること', async (t) => {
  const input = Selector('[data-test=datepicker-1]')
  await t
    .click(input)
    .pressKey('tab')
    .expect(
      elementWithId(await input.getAttribute('aria-controls')).find(
        '.smarthr-ui-Calendar-selectingYear',
      ).focused,
    )
    .ok()
})

test('カレンダー展開後にカレンダー外をクリックするとカレンダーが閉じること', async (t) => {
  const input = Selector('[data-test=datepicker-1]')
  await t
    .click(input)
    .expect(elementWithId(await input.getAttribute('aria-controls')).exists)
    .ok()
    .click('body')
    .expect(elementWithId(await input.getAttribute('aria-controls')).exists)
    .notOk()
})
