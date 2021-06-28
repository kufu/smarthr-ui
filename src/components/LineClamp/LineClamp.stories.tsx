import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'
import { PrimaryButton } from '../Button'

import { LineClamp } from './LineClamp'
import readme from './README.md'

storiesOf('LineClamp', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => {
    return (
      <>
        <Wrapper>
          <List>
            <dt>Default</dt>
            <dd>
              <Text>
                <LineClamp>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                  unknown printer took a galley of type and scrambled it to make a type specimen
                  book. It has survived not only five centuries, but also the leap into electronic
                  typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                  with desktop publishing software like Aldus PageMaker including versions of Lorem
                  Ipsum.
                </LineClamp>
              </Text>
            </dd>
            <dt>Max Lines 1 / with Light Tooltip</dt>
            <dd>
              <Text>
                <LineClamp maxLines={1} withTooltip>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                  unknown printer took a galley of type and scrambled it to make a type specimen
                  book. It has survived not only five centuries, but also the leap into electronic
                  typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                  with desktop publishing software like Aldus PageMaker including versions of Lorem
                  Ipsum.
                </LineClamp>
              </Text>
            </dd>
            <dt>Max Lines 2 / with Light Tooltip</dt>
            <dd>
              <Text>
                <LineClamp maxLines={2} withTooltip>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                  unknown printer took a galley of type and scrambled it to make a type specimen
                  book. It has survived not only five centuries, but also the leap into electronic
                  typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                  with desktop publishing software like Aldus PageMaker including versions of Lorem
                  Ipsum.
                </LineClamp>
              </Text>
            </dd>
            <dt>Max Lines 4 / with Dark Tooltip</dt>
            <dd>
              <Text>
                <LineClamp maxLines={4} toolTipType="dark" withTooltip>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                  unknown printer took a galley of type and scrambled it to make a type specimen
                  book. It has survived not only five centuries, but also the leap into electronic
                  typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                  with desktop publishing software like Aldus PageMaker including versions of Lorem
                  Ipsum.
                </LineClamp>
              </Text>
            </dd>
            <dt>with button</dt>
            <dd>
              <Button>
                <LineClamp maxLines={1} toolTipType="dark" withTooltip>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry's standard dummy text ever since the 1500s.
                </LineClamp>
              </Button>
            </dd>
          </List>
        </Wrapper>
      </>
    )
  })

const Wrapper = styled.div`
  padding: 24px;
`
const Text = styled.p`
  width: 400px;
  margin: 0 0 16px 0;
  font-size: 16px;
`
const List = styled.dl`
  margin: 1rem;
  & > dd {
    margin: 16px 0 40px;
  }
`
const Button = styled(PrimaryButton)`
  width: 200px;
`
