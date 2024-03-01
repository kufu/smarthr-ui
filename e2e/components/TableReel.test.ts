import { ClientFunction, Selector } from 'testcafe'

fixture('TableReel')
  .page(
    'http://localhost:6006/iframe.html?args=&globals=backgrounds.grid:!false&id=data-display%EF%BC%88%E3%83%87%E3%83%BC%E3%82%BF%E8%A1%A8%E7%A4%BA%EF%BC%89-table--with-reel&viewMode=story',
  )
  .beforeEach(async (t) => {
    await t.maximizeWindow()
  })

test('テーブルに横スクロールが発生したときだけ、`fixed`を指定した列が固定した見た目になっていること', async (t) => {
  const targetCell = Selector('[data-test=fixed-cell]')

  // 横スクロールが発生していないとき
  await t.expect(targetCell.hasClass('fixed')).notOk()

  // ウインドウサイズに変化することで横スクロールが発生したとき
  await t
    .resizeWindow(500, 500)
    .expect(targetCell.hasClass('fixed'))
    .ok()
    .maximizeWindow()
    .expect(targetCell.hasClass('fixed'))
    .notOk()

  // テーブル内の要素が変化することで横スクロールが発生したとき
  await ClientFunction(() => {
    const td = document.querySelector('[data-test=dynamic-change-text]')

    if (td) {
      td.textContent =
        '12345678901234567890123456789012345678901234567890123456789012345678901234567890'
    }
  })()

  await t.expect(targetCell.hasClass('fixed')).ok()
})
