import { Selector } from 'testcafe'

fixture('Dropdown')
  .page('http://localhost:6006/iframe.html?id=dropdown--all&viewMode=story')
  .beforeEach(async (t) => {
    await t.maximizeWindow()
  })

test('ボタンがクリックされるとドロップダウンが開くこと', async (t) => {
  await t
    .click(Selector('#dropdown-button-1'))
    .expect(Selector('#dropdown-list-item-1').exists)
    .ok()
})

test('ドロップダウンが展開されるとドロップダウン内のフォーカス可能な要素にフォーカスが移動すること', async (t) => {
  await t
    .click(Selector('#dropdown-button-1'))
    .expect(Selector('#dropdown-list-item-1').focused)
    .ok()
})

test('ドロップダウンが展開後にドロップダウンの外側をクリックするとドロップダウンが閉じること', async (t) => {
  await t
    .click(Selector('#dropdown-button-1'))
    .expect(Selector('#dropdown-list-item-1').exists)
    .ok()
    .click('body')
    .expect(Selector('#dropdown-list-item-1').exists)
    .notOk()
})
