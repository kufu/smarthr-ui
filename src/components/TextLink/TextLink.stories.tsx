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
      const href = '/'

      if (!e) {
        return href
      }

      location.href = href
      return
    }

    return (
      <Wrapper>
        <li>
          <TextLink href="/" prefix={<FaFlagIcon />}>
            Link to Root.
          </TextLink>
        </li>
        <li>
          <TextLink href={onClick()} onClick={onClick} suffix={<FaExternalLinkAltIcon />}>
            unuse shortcut click: Open root page with change locale.href.
            <br />
            use Cmd + click: Open root page with new Tabs.
          </TextLink>
        </li>
        <li>
          <TextLink>unuse href attribute: can tab focasable.</TextLink>
        </li>
      </Wrapper>
    )
  })

const Wrapper = styled.ul`
  list-style: none;
  margin: 24px;

  li + li {
    margin-top: 16px;
  }
`
