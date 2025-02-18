import React, { memo } from 'react'

import { Button } from '../../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { FaCircleQuestionIcon, FaGraduationCapIcon } from '../../../Icon'
import { useTranslate } from '../../hooks/useTranslate'
import { CommonButton } from '../common/CommonButton'
import { Translate } from '../common/Translate'

type Props = {
  helpPageUrl?: string | null
  schoolUrl?: string | null
}

export const Help = memo<Props>(({ helpPageUrl, schoolUrl }) =>
  helpPageUrl || schoolUrl ? <ActualHelp helpPageUrl={helpPageUrl} schoolUrl={schoolUrl} /> : null,
)

const ActualHelp: FC<Props> = ({ helpPageUrl, schoolUrl }) => {
  const translate = useTranslate()

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="skeleton" size="s" square className="[&&&]:shr-border-transparent">
          <FaCircleQuestionIcon alt="ヘルプ" />
        </Button>
      </DropdownTrigger>

      <DropdownContent controllable>
        <div className="shr-p-0.5">
          {helpPageUrl && (
            <CommonButton
              elementAs="a"
              href={helpPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              prefix={<FaCircleQuestionIcon />}
            >
              <Translate>{translate('common/help')}</Translate>
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
              <Translate>{translate('common/school')}</Translate>
            </CommonButton>
          )}
        </div>
      </DropdownContent>
    </Dropdown>
  )
}
