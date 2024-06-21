import { Selector } from 'testcafe'

fixture('ModelessDialog')
  .page(
    'http://localhost:6006/iframe.html?args=&id=dialog（ダイアログ）-modelessdialog--modeless-dialog&viewMode=story',
  )
  .beforeEach(async (t) => {
    await t.maximizeWindow()
  })

test('ダイアログが開閉できること', async (t) => {
  const trigger = Selector('[data-test=dialog-trigger]')
  const dialog = Selector('[data-test=dialog]')
  const closer = dialog.find('.smarthr-ui-ModelessDialog-closeButton')

  await t
    // トリガ押下でダイアログが開くこと
    .click(trigger)
    .expect(dialog.visible)
    .ok()
    // 裏側をクリックしてもダイアログが閉じないこと
    .click(Selector('body'), { offsetX: 0, offsetY: 0 })
    .expect(dialog.visible)
    .ok()
    // 閉じるボタン押下でダイアログが閉じること
    .click(closer)
    .expect(dialog.exists)
    .notOk()
})
