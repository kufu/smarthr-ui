import { type ComponentPropsWithoutRef, memo } from 'react'

import { Localizer } from '../../../../intl'
import { AnchorButton } from '../../../Button'
import { DropdownMenuButton } from '../../../Dropdown'
import { FaCircleQuestionIcon, FaGraduationCapIcon } from '../../../Icon'

type Props = {
  helpPageUrl?: string | null
  schoolUrl?: string | null
}

const TRIGGER: ComponentPropsWithoutRef<typeof DropdownMenuButton>['trigger'] = {
  children: <Localizer id="smarthr-ui/AppHeader/help" defaultText="ヘルプ" />,
  size: 'S',
  onlyIcon: { component: FaCircleQuestionIcon },
}

export const MobileHelp = memo<Props>(
  ({ helpPageUrl, schoolUrl }) =>
    (helpPageUrl || schoolUrl) && (
      <DropdownMenuButton trigger={TRIGGER}>
        {helpPageUrl && (
          <AnchorButton
            href={helpPageUrl}
            target="_blank"
            rel="help"
            referrerPolicy="no-referrer-when-downgrade"
            prefix={<FaCircleQuestionIcon />}
          >
            <Localizer id="smarthr-ui/AppHeader/help" defaultText="ヘルプ" />
          </AnchorButton>
        )}
        {schoolUrl && (
          <AnchorButton
            href={schoolUrl}
            target="_blank"
            rel="noopener noreferrer"
            prefix={<FaGraduationCapIcon />}
          >
            <Localizer id="smarthr-ui/AppHeader/school" defaultText="スクール" />
          </AnchorButton>
        )}
      </DropdownMenuButton>
    ),
)
