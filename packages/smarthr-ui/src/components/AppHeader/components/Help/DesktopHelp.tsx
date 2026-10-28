import { type FC, memo } from 'react'

import { Localizer } from '../../../../intl'
import { HeaderLink } from '../../../Header'
import { FaCircleQuestionIcon, FaGraduationCapIcon, FaRegCircleQuestionIcon } from '../../../Icon'

import type { HeaderProps } from '../../types'

type Props = Pick<HeaderProps, 'enableNew' | 'helpPageUrl' | 'schoolUrl'>

export const DesktopHelp: FC<Props> = ({ enableNew, helpPageUrl, schoolUrl }) => (
  <>
    {!enableNew && schoolUrl && <SchoolLink href={schoolUrl} />}
    {helpPageUrl && <HelpPageLink href={helpPageUrl} enableNew={enableNew} />}
  </>
)

const SchoolLink = memo<{ href: string }>(({ href }) => (
  <HeaderLink href={href} prefix={<FaGraduationCapIcon />}>
    <Localizer id="smarthr-ui/AppHeader/school" defaultText="スクール" />
  </HeaderLink>
))

const HelpPageLink = memo<{ href: string } & Pick<HeaderProps, 'enableNew'>>(
  ({ href, enableNew }) => (
    <HeaderLink
      href={href}
      rel="help"
      referrerPolicy="no-referrer-when-downgrade"
      enableNew={enableNew}
      prefix={enableNew ? <FaRegCircleQuestionIcon /> : <FaCircleQuestionIcon />}
    >
      <Localizer id="smarthr-ui/AppHeader/help" defaultText="ヘルプ" />
    </HeaderLink>
  ),
)
