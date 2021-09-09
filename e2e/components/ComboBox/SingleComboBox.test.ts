import { Selector } from 'testcafe'

fixture('SingleComboBox')
  .page('http://localhost:6006/iframe.html?id=combobox--single&viewMode=story')
  .beforeEach(async (t) => {
    await t.maximizeWindow()
  })

test('アイテムの選択と選択解除ができること', async (t) => {
  const combobox = Selector('[data-test=single-combobox-default]')
  const textbox = combobox.find('input[type=text]')
  const listbox = Selector(`#${await combobox.getAttribute('aria-controls')}`)
  const clearButton = combobox.find('.smarthr-ui-SingleComboBox-clearButton')

  await t
    // コンボボックスをクリックするとテキストボックスがフォーカスされること
    .click(combobox)
    .expect(textbox.focused)
    .ok()
    // アイテムを選択できること
    .click(listbox.find('.smarthr-ui-SingleComboBox-selectButton').withText('option 1'))
    .expect(textbox.value)
    .eql('option 1')
    // リストボックスが非表示になること
    .expect(listbox.visible)
    .notOk()
    // 選択したアイテムを選択解除できること
    .click(clearButton)
    .expect(textbox.value)
    .eql('')
})

test('リストボックスが開閉できること', async (t) => {
  const combobox = Selector('[data-test=single-combobox-default]')
  const listbox = Selector(`#${await combobox.getAttribute('aria-controls')}`)

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
  const combobox = Selector('[data-test=single-combobox-default]')
  const textbox = combobox.find('input[type=text]')
  const listbox = Selector(`#${await combobox.getAttribute('aria-controls')}`)
  const clearButton = combobox.find('.smarthr-ui-SingleComboBox-clearButton')

  await t
    // アイテムを選択
    .click(combobox)
    .click(listbox.find('.smarthr-ui-SingleComboBox-selectButton').withText('option 1'))
    // 外側をクリックしてフォーカスを外す
    .click('body', { offsetX: 0, offsetY: 0 })
    // 選択したアイテムを選択解除できること
    .click(clearButton)
    .expect(listbox.visible)
    .notOk()
})

test('新しいアイテムを追加できること', async (t) => {
  const combobox = Selector('[data-test=single-combobox-creatable]')
  const textbox = combobox.find('input[type=text]')
  const listbox = Selector(`#${await combobox.getAttribute('aria-controls')}`)
  const addButton = listbox.find('.smarthr-ui-SingleComboBox-addButton')
  const clearButton = combobox.find('.smarthr-ui-SingleComboBox-clearButton')

  await t
    // 新しいアイテムを追加できること
    .click(combobox)
    .typeText(textbox, 'test new item')
    .click(addButton)
    .expect(textbox.value)
    .eql('test new item')
    // 選択したアイテムを選択解除できること
    .click(clearButton)
    .expect(textbox.value)
    .eql('')
    // 新しく追加したアイテムがリストボックス内に存在すること
    .click(combobox)
    .expect(
      listbox.find('.smarthr-ui-SingleComboBox-selectButton').withText('test new item').exists,
    )
    .ok()
})

test('disabled なコンボボックスではアイテムの選択と選択解除ができないこと', async (t) => {
  const normal = Selector('[data-test=single-combobox-default]')
  const normalListbox = Selector(`#${await normal.getAttribute('aria-controls')}`)
  const disabled = Selector('[data-test=single-combobox-disabled]')
  const disabledListbox = Selector(`#${await disabled.getAttribute('aria-controls')}`)

  await t
    // disabled なコンボボックスをクリックしてもリストボックスは表示されないこと
    .click(disabled)
    .expect(disabledListbox.visible)
    .notOk()
    // 有効なコンボボックスでアイテム選択
    .click(normal)
    .click(normalListbox.find('.smarthr-ui-SingleComboBox-selectButton').withText('option 1'))
    // disabled なコンボボックスにクリアボタンが表示されないこと
    .expect(disabled.find('.smarthr-ui-SingleComboBox-clearButton').visible)
    .notOk()
})
