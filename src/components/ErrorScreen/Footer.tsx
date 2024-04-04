import React from 'react'

import { Cluster } from '../Layout'
import { TextLink } from '../TextLink'

import type { ComponentProps, ComponentPropsWithoutRef, FC } from 'react'

export const Footer: FC<ComponentPropsWithoutRef<'footer'>> = (props) => (
  <Cluster
    {...props}
    as="footer"
    align="center"
    justify="space-between"
    className="smarthr-ui-ErrorScreen-footer shr-bg-brand shr-p-1.25 shr-text-base shr-text-white"
  >
    <Cluster as="ul" align="center" className="shr-list-none">
      <Item href="https://support.smarthr.jp/">ヘルプ</Item>
      <Item href="https://smarthr.jp/update/">お知らせ</Item>
      <Item href="https://smarthr.jp/terms/">利用規約</Item>
      <Item href="https://smarthr.co.jp/privacy/">プライバシーポリシー</Item>
      <Item href="https://smarthr.co.jp">運営会社</Item>
      <Item href="https://developer.smarthr.jp">開発者向けAPI </Item>
    </Cluster>
    <small className="shr-ms-auto shr-text-base">&copy; SmartHR, Inc.</small>
  </Cluster>
)

const Item: FC<ComponentProps<typeof TextLink>> = ({ children, href }) => (
  <li>
    <TextLink
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      className="shr-text-white hover:shr-shadow-underline [&]:shr-shadow-none"
      suffix={null}
    >
      {children}
    </TextLink>
  </li>
)
