import { Selector } from 'testcafe'

fixture('FormDialog')
  .page(
    'http://localhost:6006/iframe.html?args=&id=dialog（ダイアログ）-dialog--form-dialog&viewMode=story',
  )
  .beforeEach(async (t) => {
    await t.maximizeWindow()
  })

test('ダイアログが開閉できること', async (t) => {
  const trigger = Selector('[data-test=opened-form-dialog-trigger]')
  const content = Selector('[data-test=opened-form-dialog]')
  const closer = content.find('.smarthr-ui-Dialog-closeButton')

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
})

test('開いた状態で DOM に投入されたダイアログにフォーカスが移動すること', async (t) => {
  const trigger = Selector('[data-test=opened-form-dialog-trigger]')
  const focusTarget = Selector('[data-test=opened-form-dialog-focus-target]')
  const closer = Selector('[data-test=opened-form-dialog').find('.smarthr-ui-Dialog-closeButton')

  await t
    // ダイアログを開いたとき、ダイアログ内のフォーカスターゲットがフォーカスされること
    .click(trigger)
    .expect(focusTarget.focused)
    .ok()
    // ダイアログを閉じたとき、トリガがフォーカスされること
    .click(closer)
    .expect(trigger.focused)
    .ok()
})
