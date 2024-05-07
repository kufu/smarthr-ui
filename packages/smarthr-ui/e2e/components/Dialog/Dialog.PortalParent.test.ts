import { Selector } from 'testcafe'

fixture('Dialog (Portal Parent)')
  .page(
    'http://localhost:6006/iframe.html?args=&id=dialog（ダイアログ）-dialog--body以外の-portal-parent&viewMode=story',
  )
  .beforeEach(async (t) => {
    await t.maximizeWindow()
  })

test('body 以外を親にしたダイアログが開閉できること', async (t) => {
  const trigger = Selector('[data-test=dialog-trigger]')
  const content = Selector('[data-test=dialog-content]')
  const closer = Selector('[data-test=dialog-closer]')

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
