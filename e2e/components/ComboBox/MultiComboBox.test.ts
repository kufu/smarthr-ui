import { Selector } from 'testcafe'

fixture('MultiComboBox')
  .page('http://localhost:6006/iframe.html?id=combobox--multi&viewMode=story')
  .beforeEach(async (t) => {
    await t.maximizeWindow()
  })

test('アイテムの選択と選択解除ができること', async (t) => {
  const combobox = Selector('[data-test=multi-combobox-default]')
  const textbox = combobox.find('input[type=text]')
  const listbox = Selector(`#${await combobox.getAttribute('aria-owns')}`)
  const selectedItems = combobox.find('.smarthr-ui-MultiComboBox-selectedItem')

  await t
    // コンボボックスをクリックするとテキストボックスがフォーカスされること
    .click(combobox)
    .expect(textbox.focused)
    .ok()
    // アイテムを選択できること
    .click(listbox.find('.smarthr-ui-MultiComboBox-selectButton').withText('option 1'))
    .expect(selectedItems.withText('option 1').exists)
    .ok()
    // リストボックスが表示されたままであること
    .expect(listbox.visible)
    .ok()
    // 選択したアイテムを選択解除できること
    .click(selectedItems.withText('option 1').find('.smarthr-ui-MultiComboBox-deleteButton'))
    .expect(selectedItems.withText('option 1').exists)
    .notOk()
})

test('リストボックスが開閉できること', async (t) => {
  const combobox = Selector('[data-test=multi-combobox-default]')
  const listbox = Selector(`#${await combobox.getAttribute('aria-owns')}`)

  await t
    // コンボボックスをクリックするとリストボックスが表示されること
    .click(combobox)
    .expect(listbox.visible)
    .ok()
    // 外側をクリックするとリストボックスが非表示になること
    .click('body', { offsetX: 0, offsetY: 0 })
    .expect(listbox.visible)
    .notOk()
    // 再度リストボックスを開く
    .click(combobox)
    // リストボックス表示中に Escape キーを押下するとリストボックスが非表示になること
    .pressKey('esc')
    .expect(listbox.visible)
    .notOk()
    // 再度リストボックスを開く
    .click(combobox)
    // リストボックス表示中に Tab キーを押下するとリストボックスが非表示になること
    .pressKey('tab')
    .expect(listbox.visible)
    .notOk()
})

test('コンボボックスがフォーカスされていない時に選択解除ボタンを押下してもリストボックスが表示されないこと', async (t) => {
  const combobox = Selector('[data-test=multi-combobox-default]')
  const listbox = Selector(`#${await combobox.getAttribute('aria-owns')}`)
  const selectedItems = combobox.find('.smarthr-ui-MultiComboBox-selectedItem')

  await t
    // アイテムを選択
    .click(combobox)
    .click(listbox.find('.smarthr-ui-MultiComboBox-selectButton').withText('option 1'))
    // 外側をクリックしてフォーカスを外す
    .click('body', { offsetX: 0, offsetY: 0 })
    // 選択解除ボタンを押下したときリストボックスが表示されないこと
    .click(selectedItems.withText('option 1').find('.smarthr-ui-MultiComboBox-deleteButton'))
    .expect(listbox.visible)
    .notOk()
})

test('新しいアイテムを追加できること', async (t) => {
  const combobox = Selector('[data-test=multi-combobox-creatable]')
  const textbox = combobox.find('input[type=text]')
  const listbox = Selector(`#${await combobox.getAttribute('aria-owns')}`)
  const addButton = listbox.find('.smarthr-ui-MultiComboBox-addButton')
  const selectedItems = combobox.find('.smarthr-ui-MultiComboBox-selectedItem')

  await t
    // 新しいアイテムを追加できること
    .click(combobox)
    .typeText(textbox, 'test new item')
    .click(addButton)
    .expect(selectedItems.withText('test new item').exists)
    .ok()
    // 選択したアイテムを選択解除できること
    .click(selectedItems.withText('test new item').find('.smarthr-ui-MultiComboBox-deleteButton'))
    .expect(selectedItems.withText('test new item').exists)
    .notOk()
    // 新しく追加したアイテムがリストボックス内に存在すること
    .click(combobox)
    .expect(listbox.find('.smarthr-ui-MultiComboBox-selectButton').withText('test new item').exists)
    .ok()
})

test('disabled なコンボボックスではアイテムの選択と選択解除ができないこと', async (t) => {
  const normal = Selector('[data-test=multi-combobox-default]')
  const normalListbox = Selector(`#${await normal.getAttribute('aria-owns')}`)
  const disabled = Selector('[data-test=multi-combobox-disabled]')
  const disabledListbox = Selector(`#${await disabled.getAttribute('aria-owns')}`)
  const disabledSelectedItems = disabled.find('.smarthr-ui-MultiComboBox-selectedItem')

  await t
    // disabled なコンボボックスをクリックしてもリストボックスは表示されないこと
    .click(disabled)
    .expect(disabledListbox.visible)
    .notOk()
    // 有効なコンボボックスでアイテム選択
    .click(normal)
    .click(normalListbox.find('.smarthr-ui-MultiComboBox-selectButton').withText('option 1'))
    // disabled なコンボボックスの選択済みアイテムを選択解除できないこと
    .click(
      disabledSelectedItems.withText('option 1').find('.smarthr-ui-MultiComboBox-deleteButton'),
    )
    .expect(disabledSelectedItems.withText('option 1').exists)
    .ok()
})
