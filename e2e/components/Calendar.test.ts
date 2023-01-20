import { Selector } from 'testcafe'

fixture('Calendar')
  .page(
    'http://localhost:6006/iframe.html?args=&id=data-display（データ表示）-calendar--all&viewMode=story',
  )
  .beforeEach(async (t) => {
    await t.maximizeWindow()
  })

test('日付が選択できること', async (t) => {
  const dateButton = Selector('[data-test=calendar-1] .smarthr-ui-CalendarTable-dataCell')
    .withText('10')
    .find('button')
  await t.click(dateButton).expect(dateButton.getAttribute('aria-pressed')).ok()
})

test('年を変更できること', async (t) => {
  await t
    .click(Selector('[data-test=calendar-1] .smarthr-ui-Calendar-selectingYear'))
    .click(Selector('[data-test=calendar-1] .smarthr-ui-YearPicker-selectYear').withText('2019'))
    .expect(Selector('[data-test=calendar-1] .smarthr-ui-Calendar-yearMonth').innerText)
    .eql('2019年1月')
})

test('月を変更できること', async (t) => {
  const prevButton = Selector('[data-test=calendar-1] .smarthr-ui-Calendar-monthButtonPrev')
  const nextButton = Selector('[data-test=calendar-1] .smarthr-ui-Calendar-monthButtonNext')
  const monthYear = Selector('[data-test=calendar-1] .smarthr-ui-Calendar-yearMonth').innerText
  await t
    .click(prevButton)
    .click(prevButton)
    .expect(monthYear)
    .eql('2019年11月')
    .click(nextButton)
    .click(nextButton)
    .click(nextButton)
    .expect(monthYear)
    .eql('2020年2月')
})
