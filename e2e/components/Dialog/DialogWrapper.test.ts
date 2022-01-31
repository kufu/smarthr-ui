import { Selector } from 'testcafe'

fixture('DialogWrapper')
  .page('http://localhost:6006/iframe.html?id=dialog--uncontrolled&viewMode=story')
  .beforeEach(async (t) => {
    await t.maximizeWindow()
  })

test('DialogContent が開閉できること', async (t) => {
  const trigger = Selector('[data-test=dialog-trigger]')
  const content = Selector('[data-test=dialog-content]')
  const closer = Selector('[data-test=dialog-closer]')
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

test('MessageDialogContent が開閉できること', async (t) => {
  const trigger = Selector('[data-test=message-dialog-trigger]')
  const content = Selector('[data-test=message-dialog-content]')
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

test('ActionDialogContent が開閉できること', async (t) => {
  const trigger = Selector('[data-test=action-dialog-trigger]')
  const content = Selector('[data-test=action-dialog-content]')
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
