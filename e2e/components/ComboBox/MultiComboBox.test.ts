import { Selector } from 'testcafe'

fixture('MultiComboBox')
  .page(
    'http://localhost:6006/iframe.html?args=&id=forms（フォーム）-combobox--multi&viewMode=story',
  )
  .beforeEach(async (t) => {
    await t.maximizeWindow()
  })

function elementWithId(id: string | null | undefined) {
  const actualId = !id ? '' : `#${id.replace(/:/g, '\\:')}`
  return Selector(actualId)
}

test('アイテムの選択と選択解除ができること', async (t) => {
  const wrapper = Selector('[data-test=multi-combobox-default]')
  const combobox = wrapper.find('input[role=combobox]')
  const comboboxControls = ((await combobox.getAttribute('aria-controls')) || '').split(' ')
  const listbox = elementWithId(comboboxControls[0])
  const selectedItems = elementWithId(comboboxControls[1])

  await t
    // コンボボックスをクリックするとテキストボックスがフォーカスされること
    .click(wrapper)
    .expect(combobox.focused)
    .ok()
    // アイテムを選択できること
    .click(listbox.find('.smarthr-ui-ComboBox-selectButton').withText('option 1'))
    .click(listbox.find('.smarthr-ui-ComboBox-selectButton').withText('option 2'))
    .expect(selectedItems.withText('option 1').exists)
    .ok()
    .expect(selectedItems.withText('option 2').exists)
    .ok()
    // リストボックスが表示されたままであること
    .expect(listbox.visible)
    .ok()
    // 選択したアイテムを削除ボタンで選択解除できること
    .click(selectedItems.withText('option 1').find('.smarthr-ui-MultiComboBox-deleteButton'))
    .expect(selectedItems.withText('option 1').exists)
    .notOk()
    // 選択したアイテムをリストボックスから選択解除できること
    .click(listbox.find('.smarthr-ui-ComboBox-selectButton').withText('option 2'))
    .expect(selectedItems.withText('option 2').exists)
    .notOk()
})

test('リストボックスが開閉できること', async (t) => {
  const wrapper = Selector('[data-test=multi-combobox-default]')
  const combobox = wrapper.find('input[role=combobox]')
  const comboboxControls = ((await combobox.getAttribute('aria-controls')) || '').split(' ')
  const listbox = elementWithId(comboboxControls[0])

  await t
    // コンボボックスをクリックするとリストボックスが表示されること
    .click(wrapper)
    .expect(listbox.visible)
    .ok()
    // 外側をクリックするとリストボックスが非表示になること
    .click('body', { offsetX: 0, offsetY: 0 })
    .expect(listbox.visible)
    .notOk()
    // 再度リストボックスを開く
    .click(wrapper)
    // リストボックス表示中に Escape キーを押下するとリストボックスが非表示になること
    .pressKey('esc')
    .expect(listbox.visible)
    .notOk()
    // 再度リストボックスを開く
    .click(wrapper)
    // リストボックス表示中に Tab キーを押下するとリストボックスが非表示になること
    .pressKey('tab')
    .expect(listbox.visible)
    .notOk()
})

test('コンボボックスがフォーカスされていない時に選択解除ボタンを押下してもリストボックスが表示されないこと', async (t) => {
  const wrapper = Selector('[data-test=multi-combobox-default]')
  const combobox = wrapper.find('input[role=combobox]')
  const comboboxControls = ((await combobox.getAttribute('aria-controls')) || '').split(' ')
  const listbox = elementWithId(comboboxControls[0])
  const selectedItems = elementWithId(comboboxControls[1])

  await t
    // アイテムを選択
    .click(wrapper)
    .click(listbox.find('.smarthr-ui-ComboBox-selectButton').withText('option 1'))
    // 外側をクリックしてフォーカスを外す
    .click('body', { offsetX: 0, offsetY: 0 })
    // 選択解除ボタンを押下したときリストボックスが表示されないこと
    .click(selectedItems.withText('option 1').find('.smarthr-ui-MultiComboBox-deleteButton'))
    .expect(listbox.visible)
    .notOk()
})

test('新しいアイテムを追加できること', async (t) => {
  const wrapper = Selector('[data-test=multi-combobox-creatable]')
  const combobox = wrapper.find('input[role=combobox]')
  const comboboxControls = ((await combobox.getAttribute('aria-controls')) || '').split(' ')
  const listbox = elementWithId(comboboxControls[0])
  const addButton = listbox.find('.smarthr-ui-ComboBox-addButton')
  const selectedItems = elementWithId(comboboxControls[1])

  await t
    // 新しいアイテムを追加できること
    .click(wrapper)
    .typeText(combobox, 'test new item')
    .click(addButton)
    .expect(selectedItems.withText('test new item').exists)
    .ok()
    // 選択したアイテムを選択解除できること
    .click(selectedItems.withText('test new item').find('.smarthr-ui-MultiComboBox-deleteButton'))
    .expect(selectedItems.withText('test new item').exists)
    .notOk()
    // 新しく追加したアイテムがリストボックス内に存在すること
    .click(wrapper)
    .expect(listbox.find('.smarthr-ui-ComboBox-selectButton').withText('test new item').exists)
    .ok()
})

test('disabled なコンボボックスではアイテムの選択と選択解除ができないこと', async (t) => {
  const normal = Selector('[data-test=multi-combobox-default]')
  const normalCombobox = normal.find('input[role=combobox]')
  const normalComboboxControls = ((await normalCombobox.getAttribute('aria-controls')) || '').split(
    ' ',
  )
  const normalListbox = elementWithId(normalComboboxControls[0])

  const disabled = Selector('[data-test=multi-combobox-disabled]')
  const disabledCombobox = disabled.find('input[role=combobox]')
  const disabledComboboxControls = (
    (await disabledCombobox.getAttribute('aria-controls')) || ''
  ).split(' ')
  const disabledListbox = elementWithId(disabledComboboxControls[0])
  const disabledSelectedItems = elementWithId(disabledComboboxControls[1])

  await t
    // disabled なコンボボックスをクリックしてもリストボックスは表示されないこと
    .click(disabled)
    .expect(disabledListbox.visible)
    .notOk()
    // 有効なコンボボックスでアイテム選択
    .click(normal)
    .click(normalListbox.find('.smarthr-ui-ComboBox-selectButton').withText('option 1'))
    // disabled なコンボボックスの選択済みアイテムの削除ボタンが disabled であること
    .expect(
      disabledSelectedItems
        .withText('option 1')
        .find('.smarthr-ui-MultiComboBox-deleteButton')
        .hasAttribute('disabled'),
    )
    .ok()
})

test.only('キーボードで選択済みアイテムリストが操作できること', async (t) => {
  const wrapper = Selector('[data-test=multi-combobox-default]')
  const combobox = wrapper.find('input[role=combobox]')
  const comboboxControls = ((await combobox.getAttribute('aria-controls')) || '').split(' ')
  const listbox = elementWithId(comboboxControls[0])

  const findOption = (label: string) =>
    listbox.find('.smarthr-ui-ComboBox-selectButton').withText(label)
  const findDeleteButton = (label: string) =>
    wrapper
      .find('.smarthr-ui-MultiComboBox-selectedItem')
      .withText(label)
      .find('.smarthr-ui-MultiComboBox-deleteButton')

  await t
    // アイテムを選択
    .click(wrapper)
    .click(findOption('option 1'))
    .click(findOption('option 2'))
    .click(findOption('option 5'))
    .typeText(combobox, 'opt')
    // テキストボックス内のキャレットが先頭にない場合は削除ボタンにフォーカスが移動しないこと
    .pressKey('left')
    .expect(combobox.focused)
    .ok()
    .pressKey('left')
    .expect(combobox.focused)
    .ok()
    .pressKey('left')
    .expect(combobox.focused)
    .ok()
    // テキストボックス内のキャレットが先頭にある状態で左矢印キーを押下すると、削除ボタンにフォーカスが移動すること
    .pressKey('left')
    .expect(findDeleteButton('option 5').focused)
    .ok()
    .pressKey('left')
    .expect(findDeleteButton('option 2').focused)
    .ok()
    .pressKey('left')
    .expect(findDeleteButton('option 1').focused)
    .ok()
    // 最初の削除ボタンがフォーカスされている状態で左矢印キーを押下しても、フォーカスが移動しないこと
    .pressKey('left')
    .expect(findDeleteButton('option 1').focused)
    .ok()
    // 削除ボタンがフォーカスされている状態で右矢印キーを押下すると、フォーカスが移動すること
    .pressKey('right')
    .expect(findDeleteButton('option 2').focused)
    .ok()
    .pressKey('right')
    .expect(findDeleteButton('option 5').focused)
    .ok()
    // 最後の削除ボタンがフォーカスされている状態で右矢印キーを押下すると、input にフォーカスが移動すること
    .pressKey('right')
    .expect(combobox.focused)
    .ok()
    // 削除ボタンを操作できること
    .pressKey('left')
    .pressKey('enter')
    .expect(wrapper.find('.smarthr-ui-MultiComboBox-selectedItem').withText('option 5').exists)
    .notOk()
    .pressKey('left')
    .pressKey('backspace')
    .expect(wrapper.find('.smarthr-ui-MultiComboBox-selectedItem').withText('option 2').exists)
    .notOk()
    // テキストボックスにフォーカスがあたってる場合は Backspace で末尾のアイテムを削除できること
    .pressKey('backspace')
    .expect(wrapper.find('.smarthr-ui-MultiComboBoxyy-selectedItem').withText('option 1').exists)
    .notOk()
    // Backspace によって削除した末尾アイテムはテキスト化されるが、選択状態になっているので再度 Backspace でテキストも削除できること
    .expect(wrapper.find('.smarthr-ui-MultiComboBox-input').value)
    .eql('option 1')
    .pressKey('backspace')
    .expect(wrapper.find('.smarthr-ui-MultiComboBox-input').value)
    .eql('')
})

test('キーボードでリストボックスが操作できること', async (t) => {
  const wrapper = Selector('[data-test=multi-combobox-default]')
  const comboBoxSelected = wrapper.find('.smarthr-ui-MultiComboBox-selectedItem')

  await t
    // タブキーでフォーカスされたとき、テキストボックスがフォーカスされること
    .pressKey('tab')
    .expect(wrapper.find('.smarthr-ui-MultiComboBox-input').focused)
    .ok()
    // アイテムが選択できること
    .pressKey('down')
    .pressKey('enter')
    .expect(comboBoxSelected.withText('option 1').exists)
    .ok()
    .pressKey('up')
    .pressKey('up')
    .pressKey('up')
    .pressKey('enter')
    .expect(comboBoxSelected.withText('option 5').exists)
    .ok()
    // 選択解除ができること
    .pressKey('down')
    .pressKey('down')
    .pressKey('down')
    .pressKey('enter')
    .expect(comboBoxSelected.withText('option 1').exists)
    .notOk()
})

test('部分的レンダリングしているアイテム数がスクロールにより順次増加すること', async (t) => {
  const wrapper = Selector('[data-test=multi-combobox-many]')
  const combobox = wrapper.find('input[role=combobox]')
  const comboboxControls = ((await combobox.getAttribute('aria-controls')) || '').split(' ')
  const listbox = elementWithId(comboboxControls[0])

  await t
    .click(wrapper)
    .expect(listbox.find('.smarthr-ui-ComboBox-selectButton').count)
    .eql(100)
    .scroll(listbox, 'bottom')
    .expect(listbox.find('.smarthr-ui-ComboBox-selectButton').count)
    .eql(200)
    .scroll(listbox, 'bottom')
    .expect(listbox.find('.smarthr-ui-ComboBox-selectButton').count)
    .eql(300)
})
