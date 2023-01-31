import React, { VFC } from 'react'

import {
  AnchorButton,
  Button,
  DangerButton,
  DangerButtonAnchor,
  PrimaryButton,
  PrimaryButtonAnchor,
  SecondaryButton,
  SecondaryButtonAnchor,
  SkeletonButton,
  SkeletonButtonAnchor,
  TextButton,
  TextButtonAnchor,
  UnstyledButton,
} from '.'

export const Style: VFC = () => (
  <>
    <Button />
    <AnchorButton />
    <PrimaryButton />
    {/* eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute */}
    <PrimaryButtonAnchor />
    <SecondaryButton />
    {/* eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute */}
    <SecondaryButtonAnchor />
    <DangerButton />
    {/* eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute */}
    <DangerButtonAnchor />
    <SkeletonButton />
    {/* eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute */}
    <SkeletonButtonAnchor />
    <TextButton />
    {/* eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute */}
    <TextButtonAnchor />
    <UnstyledButton />
  </>
)
export const PREFIX = 'Button'
