import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Header } from './Header'
import {
  FaQuestionCircle,
  FaEdit,
  FaRegPlusSquare,
  FaSyncAlt,
  FaPaperPlane,
  FaCog,
  FaBuilding,
  FaGraduationCap,
  FaPowerOff,
} from 'react-icons/fa'

const employeeButtonMenu = [
  {
    type: 'link' as 'link',
    title: '新規登録する（手入力）',
    url: '/crews/new',
    icon: <FaEdit />,
  },
  {
    type: 'link' as 'link',
    title: '新規登録する（ファイル）',
    url: '/crews/bulk_inserter',
    icon: <FaRegPlusSquare />,
  },
  {
    type: 'link' as 'link',
    title: '更新する（ファイル）',
    url: '/crews/bulk_updater',
    icon: <FaSyncAlt />,
  },
  {
    type: 'divider' as 'divider',
  },
  {
    type: 'link' as 'link',
    title: 'SmartHR に招待',
    url: '/crews/inviter',
    icon: <FaPaperPlane />,
  },
]

const userButtonMenu = [
  {
    type: 'header' as 'header',
    title: 'test@smarthr.co.jp',
  },
  {
    type: 'link' as 'link',
    title: '個人設定',
    url: '/my/account',
    icon: <FaCog />,
  },
  {
    type: 'divider' as 'divider',
  },
  {
    type: 'header' as 'header',
    title: '株式会社TESTINC',
  },
  {
    type: 'link' as 'link',
    title: '共通設定',
    url: '/admin/company',
    icon: <FaBuilding />,
  },
  {
    type: 'divider' as 'divider',
  },
  {
    type: 'link' as 'link',
    title: 'ヘルプ',
    url: 'https://smarthr.jp/hel',
    icon: <FaQuestionCircle />,
    target: '_blank',
  },
  {
    type: 'link' as 'link',
    title: 'SmartHR スクール',
    url: 'https://smarthr.thinkific.com/',
    icon: <FaGraduationCap />,
    target: '_blank',
  },
  {
    type: 'link' as 'link',
    title: 'ログアウト',
    url: 'https://test-inc.smarthr.jp/logout',
    icon: <FaPowerOff />,
  },
]

storiesOf('Header', module).add('all', () => (
  <Header
    tenantName="TESTINC 株式会社"
    helpButtonLink="https://smarthr.jp/help/"
    employeeListButtonLink="/crews"
    userMailAddress="test@smarthr.co.jp"
    employeeButtonMenu={employeeButtonMenu}
    userButtonMenu={userButtonMenu}
    notificationNumber={100}
  />
))
