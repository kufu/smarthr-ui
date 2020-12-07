import { Selector } from 'testcafe'

fixture('Dropdown:all')
  .page('http://localhost:6006/iframe.html?id=dropdown--all&viewMode=story')
  .beforeEach(async (t) => {
    await t.maximizeWindow()
  })

test('Click the trigger to see the Dropdown', async (t) => {
  await t
    .click(Selector('#dropdown-button-1'))
    .expect(Selector('#dropdown-list-item-1').exists)
    .ok()
})

test('Click an element in the Dropdown to close the Dropdown', async (t) => {
  await t
    .click(Selector('#dropdown-button-1'))
    .click(Selector('#dropdown-list-item-1'))
    .expect(Selector('#dropdown-list-item-1').exists)
    .notOk()
})
