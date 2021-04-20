import { storiesOf } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'
import { TextLink } from './TextLink'
import { FaExternalLinkAltIcon, FaFlagIcon } from '../Icon'
import readme from './README.md'

storiesOf('TextLink', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => {
    const onClick = (e?: React.MouseEvent) => {
      if (!e) {
        return '/'
      }

      location.href = '/'
      return
    }

    return (
      <Wrapper>
        <TextLink href="/" prefix={<FaFlagIcon />}>
          Link to Root.
        </TextLink>
        <br />
        <TextLink href={onClick()} onClick={onClick} suffix={<FaExternalLinkAltIcon />}>
          unuse shortcut click: Open root page with change locale.href.
          <br />
          use Cmd + click: Open root page with new Tabs.
        </TextLink>
      </Wrapper>
    )
  })

const Wrapper = styled.div`
  margin: 24px;
`
