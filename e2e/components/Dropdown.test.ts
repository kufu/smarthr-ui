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

test('トリガとドロップダウン間でフォーカスの行き来ができること', async (t) => {
  const trigger = Selector('#dropdown-button-1')
  const firstFocusable = Selector('#dropdown-list-item-1')
  await t
    .click(trigger)
    // Tab キーを押下すると、ドロップダウン内の最初のフォーカス可能要素にフォーカスが移動すること
    .pressKey('tab')
    .expect(firstFocusable.focused)
    .ok()
    // 最初のフォーカス可能要素がフォーカスされた状態で Shift + Tab キーを押下すると、トリガにフォーカスが移動すること
    .pressKey('shift+tab')
    .expect(trigger.focused)
    .ok()
    // ドロップダウンが展開されていてトリガがフォーカスされている状態で Tab キーを押下すると、ドロップダウン内の最初のフォーカス可能要素にフォーカスが移動すること
    .pressKey('tab')
    .expect(firstFocusable.focused)
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
