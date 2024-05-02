import { Selector } from 'testcafe'

fixture('Dialog')
  .page(
    'http://localhost:6006/iframe.html?args=&id=dialog（ダイアログ）-dialog--default&viewMode=story',
  )
  .beforeEach(async (t) => {
    await t.maximizeWindow()
  })

test('ダイアログが開閉できること', async (t) => {
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

  // 背景クリックでダイアログが閉じないことを確認
  await t.click(trigger).click(background, { offsetX: 0, offsetY: 0 }).expect(content.exists).ok()
})

test('フォーカストラップが動作すること', async (t) => {
  const trigger = Selector('[data-test=dialog-trigger]')
  const datePicker = Selector('[data-test=dialog-datepicker]')
  const closer = Selector('[data-test=dialog-closer]')

  await t
    .click(trigger)
    .pressKey('shift+tab')
    .expect(closer.focused)
    .ok()
    .pressKey('tab')
    .expect(datePicker.focused)
    .ok()
})

test('開いた時に特定の要素をフォーカスできること', async (t) => {
  const trigger = Selector('[data-test=dialog-focus-trigger]')
  const input = Selector('[data-test=input-focus-target]')

  await t.click(trigger).expect(input.focused).ok()
})
