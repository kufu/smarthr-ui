import React, { VFC, memo } from 'react'
import styled from 'styled-components'

import { VISUALLY_HIDDEN_STYLE } from '../../constants'

type Props = {
  selectedLabels: string[]
}

export const MultiOffScreenSelectedLive: VFC<Props> = memo(({ selectedLabels }) => {
  return (
    <OffScreen aria-live="polite" aria-atomic>
      {selectedLabels.length > 0 ? (
        <>
          選択済みの項目
          {selectedLabels.map((selectedLabel, i) => (
            <p key={i}>{selectedLabel}</p>
          ))}
        </>
      ) : (
        <p>選択済みの項目はありません</p>
      )}
    </OffScreen>
  )
})

const OffScreen = styled.div`
  ${VISUALLY_HIDDEN_STYLE}
`
