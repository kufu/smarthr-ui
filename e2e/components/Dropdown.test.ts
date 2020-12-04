import { Selector } from 'testcafe'

fixture('Dropdown')
  .page('http://localhost:6006/iframe.html?id=dropdown--all&viewMode=story')
  .beforeEach(async (t) => {
    await t.maximizeWindow()
  })

test('sample test', async (t) => {
  await t
    .click(Selector('#dropdown-button-1'))
    .expect(Selector('#dropdown-list-item-1').exists)
    .ok()
})
