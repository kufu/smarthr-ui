import { storiesOf } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { InformationPanel } from './InformationPanel'

storiesOf('InformationPanel', module).add('all', () => (
  <Wrapper>
    <InformationPanel title="パネルタイトル">
      パネルコンテンツパネルコンテンツパネルコンテンツパネルコンテンツパネルコンテンツパネルコンテンツパネルコンテンツパネルコンテンツパネルコンテンツパネルコンテンツパネルコンテンツパネルコンテンツパネルコンテンツ
    </InformationPanel>
  </Wrapper>
))

const Wrapper = styled.div`
  width: 1140px;
  margin: 32px auto;
`
