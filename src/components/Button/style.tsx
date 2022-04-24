import React, { VFC } from 'react'
import {
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
} from './'

export const Style: VFC = () => (
  <>
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
