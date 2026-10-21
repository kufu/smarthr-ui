import { render, screen } from '@testing-library/react'

import { DefinitionList } from './DefinitionList'
import { DefinitionListItem } from './DefinitionListItem'

describe('DefinitionList', () => {
  test('gapを指定しない場合、デフォルト値(1.5)に基づいてmaxColumnsのflexBasisが計算されること', () => {
    render(
      <DefinitionList>
        <DefinitionListItem maxColumns={2} term="term">
          description
        </DefinitionListItem>
      </DefinitionList>,
    )
    const item = screen.getByText('term').closest('.smarthr-ui-DefinitionListItem')!

    expect(item).toHaveStyle('flex-basis: calc((100% - 24px * 1) / 2)')
  })

  test('gapを指定した場合、その値に基づいてmaxColumnsのflexBasisが計算されること', () => {
    render(
      <DefinitionList gap={3}>
        <DefinitionListItem maxColumns={2} term="term">
          description
        </DefinitionListItem>
      </DefinitionList>,
    )
    const item = screen.getByText('term').closest('.smarthr-ui-DefinitionListItem')!

    expect(item).toHaveStyle('flex-basis: calc((100% - 48px * 1) / 2)')
  })

  test('gapにSeparatePositiveGapを指定した場合、column成分に基づいてmaxColumnsのflexBasisが計算されること', () => {
    render(
      <DefinitionList gap={{ row: 1, column: 4 }}>
        <DefinitionListItem maxColumns={2} term="term">
          description
        </DefinitionListItem>
      </DefinitionList>,
    )
    const item = screen.getByText('term').closest('.smarthr-ui-DefinitionListItem')!

    expect(item).toHaveStyle('flex-basis: calc((100% - 64px * 1) / 2)')
  })
})
