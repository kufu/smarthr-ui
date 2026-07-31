import { type FC, memo } from 'react'

import { Localizer } from '../../../../intl'
import { Button } from '../../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { FaCircleQuestionIcon, FaGraduationCapIcon } from '../../../Icon'
import { CommonButton } from '../common/CommonButton'
import { Translate } from '../common/Translate'

type Props = {
  helpPageUrl?: string | null
  schoolUrl?: string | null
}

export const Help = memo<Props>(({ helpPageUrl, schoolUrl }) =>
  helpPageUrl || schoolUrl ? <ActualHelp helpPageUrl={helpPageUrl} schoolUrl={schoolUrl} /> : null,
)

const ActualHelp: FC<Props> = ({ helpPageUrl, schoolUrl }) => (
  <Dropdown>
    <MemoizedDropdownTrigger />
    <DropdownContent controllable>
      <ContentBody helpPageUrl={helpPageUrl} schoolUrl={schoolUrl} />
    </DropdownContent>
  </Dropdown>
)

const MemoizedDropdownTrigger = memo(() => (
  <DropdownTrigger>
    <Button variant="skeleton" size="S" className="[&&&]:shr-border-transparent">
      <FaCircleQuestionIcon
        alt={<Localizer id="smarthr-ui/AppHeader/help" defaultText="ヘルプ" />}
      />
    </Button>
  </DropdownTrigger>
))

const ContentBody = memo<Props>(({ helpPageUrl, schoolUrl }) => (
  <div className="shr-p-0.5">
    {helpPageUrl && (
      <CommonButton
        elementAs="a"
        href={helpPageUrl}
        target="_blank"
        rel="help"
        referrerPolicy="no-referrer-when-downgrade"
        prefix={<FaCircleQuestionIcon />}
      >
        <Translate>
          <Localizer id="smarthr-ui/AppHeader/help" defaultText="ヘルプ" />
        </Translate>
      </CommonButton>
    )}
    {schoolUrl && (
      <CommonButton
        elementAs="a"
        href={schoolUrl}
        target="_blank"
        rel="noopener noreferrer"
        prefix={<FaGraduationCapIcon />}
      >
        <Translate>
          <Localizer id="smarthr-ui/AppHeader/school" defaultText="スクール" />
        </Translate>
      </CommonButton>
    )}
  </div>
))
