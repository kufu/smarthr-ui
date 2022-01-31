import { Selector } from 'testcafe'

fixture('ActionDialog')
  .page('http://localhost:6006/iframe.html?id=dialog--action-dialog&viewMode=story')
  .beforeEach(async (t) => {
    await t.maximizeWindow()
  })

test('ダイアログが開閉できること', async (t) => {
  const trigger = Selector('[data-test=dialog-trigger]')
  const content = Selector('[data-test=dialog-content]')
  const closer = content.find('.smarthr-ui-Dialog-closeButton')
  const background = content
    .parent('.smarthr-ui-Dialog-wrapper')
    .find('.smarthr-ui-Dialog-background')

  await t
    .click(trigger)
    .expect(content.visible)
    .ok()
    .click(closer)
    .expect(content.exists)
    .notOk()
    // ダイアログを閉じた後、トリガがフォーカスされることを確認
    .expect(trigger.focused)
    .ok()

  // 背景クリックでダイアログが閉じることを確認
  await t
    .click(trigger)
    .click(background, { offsetX: 0, offsetY: 0 })
    .expect(content.exists)
    .notOk()
})
