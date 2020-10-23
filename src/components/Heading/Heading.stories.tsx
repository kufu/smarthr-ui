import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Heading } from './Heading'
import { H } from './H'
import { Section } from './Section'

import readme from './README.md'

storiesOf('Heading', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <List>
      <li>
        <Heading type="screenTitle" tag="h1">
          ScreenTitle
        </Heading>
      </li>
      <li>
        <Heading type="sectionTitle" tag="h2">
          SectionTitle
        </Heading>
      </li>
      <li>
        <Heading type="blockTitle" tag="h3">
          BlockTitle
        </Heading>
      </li>
      <li>
        <Heading type="subBlockTitle" tag="h4">
          SubBlockTitle
        </Heading>
      </li>
      <li>
        <Heading type="subSubBlockTitle" tag="h5">
          SubSubBlockTitle
        </Heading>
      </li>
    </List>
  ))
  .add('contextual heading', () => (
    <Wrapper>
      <H>This is h1</H>
      <Section>
        <H>This is h2</H>
        <Section>
          <H>This is h3</H>
          <Section>
            <H>This is h4</H>
            <Section>
              <H>This is h5</H>
              <Section>
                <H>This is h6</H>
                <Section>
                  <H>It does not get smaller than h6</H>
                </Section>
              </Section>
            </Section>
          </Section>
        </Section>
      </Section>
    </Wrapper>
  ))

const List = styled.ul`
  padding: 0 2.4rem;
  list-style: none;

  & > li {
    &:not(:first-child) {
      margin-top: 2.4rem;
    }

    & > *:not(:first-child) {
      margin-left: 1.6rem;
    }
  }
`
const Wrapper = styled.div`
  padding: 1rem;
  section {
    padding: 1rem;
    background-color: rgba(150, 150, 150, 0.1);
  }
`
