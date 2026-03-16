import { type FC, memo, useMemo } from 'react'

import { useIntl } from '../../../../intl'
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

const MemoizedDropdownTrigger = memo(() => {
  const { localize } = useIntl()
  const translated = useMemo(
    () => ({
      help: localize({ id: 'smarthr-ui/AppHeader/help', defaultText: 'ヘルプ' }),
    }),
    [localize],
  )

  return (
    <DropdownTrigger>
      <Button variant="skeleton" size="s" className="[&&&]:shr-border-transparent">
        <FaCircleQuestionIcon alt={translated.help} />
      </Button>
    </DropdownTrigger>
  )
})

const ContentBody = memo<Props>(({ helpPageUrl, schoolUrl }) => {
  const { localize } = useIntl()
  const translated = useMemo(
    () => ({
      help: localize({ id: 'smarthr-ui/AppHeader/help', defaultText: 'ヘルプ' }),
      school: localize({ id: 'smarthr-ui/AppHeader/school', defaultText: 'スクール' }),
    }),
    [localize],
  )

  return (
    <div className="shr-p-0.5">
      {helpPageUrl && (
        <CommonButton
          elementAs="a"
          href={helpPageUrl}
          target="_blank"
          rel="noopener noreferrer"
          prefix={<FaCircleQuestionIcon />}
        >
          <Translate>{translated.help}</Translate>
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
          <Translate>{translated.school}</Translate>
        </CommonButton>
      )}
    </div>
  )
})
