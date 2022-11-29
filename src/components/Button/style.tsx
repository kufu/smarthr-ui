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
    <PrimaryButtonAnchor />
    <SecondaryButton />
    <SecondaryButtonAnchor />
    <DangerButton />
    <DangerButtonAnchor />
    <SkeletonButton />
    <SkeletonButtonAnchor />
    <TextButton />
    <TextButtonAnchor />
    <UnstyledButton />
  </>
)
export const PREFIX = 'Button'
