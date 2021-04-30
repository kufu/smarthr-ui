import { Story } from '@storybook/react'
import React, { useState } from 'react'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'

import { MultiComboBox, SingleComboBox } from '.'

import readme from './README.md'

export default {
  title: 'ComboBox',
  component: SingleComboBox,
  subcomponents: { MultiComboBox },
  parameters: {
    docs: {
      description: { component: readme },
      source: { type: 'dynamic' },
    },
  },
}

const defaultItems = [
  {
    label: 'option 1',
    value: 'value-1',
  },
  {
    label: 'option 2',
    value: 'value-2',
  },
  {
    label: 'option 3',
    value: 'value-3',
    disabled: true,
  },
  {
    label: 'option 4',
    value: 'value-4',
  },
  {
    label: 'option 5',
    value: 'value-5',
  },
]

type Item = { label: string; value: string }

export const Default: Story = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [selectedItems, setSelectedItems] = useState<Item[]>([])

  return (
    <List>
      <dt>Single</dt>
      <dd>
        <SingleComboBox
          items={defaultItems}
          selectedItem={selectedItem}
          width={400}
          placeholder="Enter the text for filtering"
          onSelect={(option) => {
            action('onSelect')(option)
            setSelectedItem(option)
          }}
        />
      </dd>
      <dt>Multi</dt>
      <dd>
        <MultiComboBox
          items={defaultItems}
          selectedItems={selectedItems}
          width={400}
          placeholder="Enter the text for filtering"
          onDelete={({ value }) => {
            setSelectedItems(selectedItems.filter((item) => item.value !== value))
          }}
          onSelect={(option) => {
            action('onSelect')(option)
            setSelectedItems([...selectedItems, option])
          }}
        />
      </dd>
    </List>
  )
}

export const Creatable: Story = () => {
  const [singleItems, setSingleItems] = useState(defaultItems)
  const [multiItems, setMultiItems] = useState(defaultItems)
  const [singleSelected, setSingleSelected] = useState<Item | null>(null)
  const [multiSelected, setMultiSelected] = useState<Item[]>([])
  const [seq, setSeq] = useState(0)

  return (
    <List>
      <dt>Single</dt>
      <dd>
        <SingleComboBox
          items={singleItems}
          selectedItem={singleSelected}
          creatable
          placeholder="You can add new items."
          width={400}
          onAdd={(label) => {
            action('onAdd')(label)
            setSingleItems([
              ...singleItems,
              {
                label: label,
                value: `new-value-${seq}`,
                disabled: label === 'disabled',
              },
            ])
            setSingleSelected({
              label,
              value: `new-value-${seq}`,
            })
            setSeq(seq + 1)
          }}
          onSelect={(option) => {
            action('onSelect')(option)
            setSingleSelected(option)
          }}
        />
      </dd>
      <dt>Multi</dt>
      <dd>
        <MultiComboBox
          items={multiItems}
          selectedItems={multiSelected}
          creatable
          placeholder="You can add new items."
          width={400}
          onAdd={(label) => {
            setMultiItems([
              ...multiItems,
              {
                label: label,
                value: `new-value-${seq}`,
                disabled: label === 'disabled',
              },
            ])
            setMultiSelected([
              ...multiSelected,
              {
                label,
                value: `new-value-${seq}`,
              },
            ])
            setSeq(seq + 1)
          }}
          onDelete={({ value }) => {
            setMultiSelected(multiSelected.filter((item) => item.value !== value))
          }}
          onSelect={({ value, label }) => {
            setMultiSelected([
              ...multiSelected,
              {
                value,
                label,
              },
            ])
          }}
        />
      </dd>
    </List>
  )
}
Creatable.parameters = {
  docs: {
    description: {
      story: 'A combobox can be added new items fron input.',
    },
  },
}

export const Disabled: Story = () => {
  return (
    <List>
      <dt>Single</dt>
      <dd>
        <SingleComboBox
          items={[]}
          selectedItem={null}
          disabled
          placeholder="Disabled"
          width={400}
          onAdd={action('onAdd')}
          onSelect={action('onSelect')}
        />
      </dd>
      <dt>Multi</dt>
      <dd>
        <MultiComboBox
          items={[]}
          selectedItems={[]}
          disabled
          placeholder="Disabled"
          width={400}
          onAdd={action('onAdd')}
          onDelete={action('onDelete')}
          onSelect={action('onSelect')}
        />
      </dd>
    </List>
  )
}
Disabled.parameters = {
  docs: {
    description: {
      story: 'A combobox can be disabled.',
    },
  },
}

export const Error: Story = () => {
  return (
    <List>
      <dt>Single</dt>
      <dd>
        <SingleComboBox
          items={[]}
          selectedItem={null}
          error
          placeholder="Error"
          width={400}
          onAdd={action('onAdd')}
          onSelect={action('onSelect')}
        />
      </dd>
      <dt>Multi</dt>
      <dd>
        <MultiComboBox
          items={[]}
          selectedItems={[]}
          error
          placeholder="Error"
          width={400}
          onAdd={action('onAdd')}
          onDelete={action('onDelete')}
          onSelect={action('onSelect')}
        />
      </dd>
    </List>
  )
}
Error.parameters = {
  docs: {
    description: {
      story: 'A combobox can represent its error status.',
    },
  },
}

export const Loading: Story = () => {
  return (
    <List>
      <dt>Single</dt>
      <dd>
        <SingleComboBox
          items={defaultItems}
          selectedItem={null}
          width={400}
          placeholder="Loading"
          onSelect={action('onSelect')}
          isLoading
        />
      </dd>
      <dt>Multi</dt>
      <dd>
        <MultiComboBox
          items={defaultItems}
          selectedItems={[]}
          width={400}
          placeholder="Loading"
          onDelete={action('onDelete')}
          onSelect={action('onSelect')}
          isLoading
        />
      </dd>
    </List>
  )
}

export const Deletable: Story = () => {
  return (
    <MultiComboBox
      items={[]}
      selectedItems={[
        { label: 'deletable', value: 'deletable' },
        { label: 'undeletable', value: 'undeletable', deletable: false },
      ]}
      width={400}
      onDelete={action('onDelete')}
      onSelect={action('onSelect')}
    />
  )
}
Deletable.parameters = {
  docs: {
    description: {
      story: 'The selected items of `MultiConboBox` can be undeletable.',
    },
  },
}

const List = styled.dl`
  margin: 0;
  dd {
    margin: 1rem 0;
  }
`
