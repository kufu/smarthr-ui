import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { useTheme } from '../../hooks/useTheme'
import { Loader } from './Loader'
import readme from './README.md'

storiesOf('Loader', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => {
    const theme = useTheme()
    return (
      <>
        <GrayWrapper>
          <Text>You can choose the size.</Text>
          <Inner>
            <Loader size="s" />
            <Loader size="m" />
          </Inner>
        </GrayWrapper>

        <Wrapper>
          <Text>You can choose the color.</Text>
          <Inner>
            <Loader color={theme.palette.BRAND} />
            <Loader color={theme.palette.TEXT_LINK} />
            <Loader color={theme.palette.WARNING} />
            <Loader color={theme.palette.DANGER} />
          </Inner>
        </Wrapper>
      </>
    )
  })

const Wrapper = styled.div`
  padding: 24px;
`
const GrayWrapper = styled(Wrapper)`
  background-color: #c1c1c1;
`
const Inner = styled.div`
  display: flex;
  align-items: center;

  & > *:not(:first-child) {
    margin-left: 24px;
  }
`
const Text = styled.p`
  margin: 0 0 16px 0;
  font-size: 18px;
`
