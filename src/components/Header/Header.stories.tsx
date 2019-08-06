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
    url: '#menu1',
    icon: <FaEdit />,
  },
  {
    type: 'link' as 'link',
    title: '新規登録する（ファイル）',
    url: '#menu2',
    icon: <FaRegPlusSquare />,
  },
  {
    type: 'link' as 'link',
    title: '更新する（ファイル）',
    url: '#menu3',
    icon: <FaSyncAlt />,
  },
  {
    type: 'divider' as 'divider',
  },
  {
    type: 'link' as 'link',
    title: 'SmartHR に招待',
    url: '#menu4',
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
    url: '#menu1',
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
    url: '#menu2',
    icon: <FaBuilding />,
  },
  {
    type: 'divider' as 'divider',
  },
  {
    type: 'link' as 'link',
    title: 'ヘルプ',
    url: '#menu3',
    icon: <FaQuestionCircle />,
  },
  {
    type: 'link' as 'link',
    title: 'SmartHR スクール',
    url: '#menu4',
    icon: <FaGraduationCap />,
  },
  {
    type: 'link' as 'link',
    title: 'ログアウト',
    url: '#menu5',
    icon: <FaPowerOff />,
  },
]

storiesOf('Header', module).add('all', () => (
  <Header
    tenantName="TESTINC 株式会社"
    helpButtonLink="#help"
    employeeListButtonLink="#employees"
    userMailAddress="test@smarthr.co.jp"
    employeeButtonMenu={employeeButtonMenu}
    userButtonMenu={userButtonMenu}
    notificationNumber={100}
  />
))
