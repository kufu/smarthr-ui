import { Button } from '../../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { FaCircleQuestionIcon, FaGraduationCapIcon } from '../../../Icon'
import { useTranslate } from '../../hooks/useTranslate'
import { CommonButton } from '../common/CommonButton'
import { Translate } from '../common/Translate'

import type { FC } from 'react'

type Props = {
  helpPageUrl?: string | null
  schoolUrl?: string | null
}

export const Help: FC<Props> = ({ helpPageUrl, schoolUrl }) => {
  const translate = useTranslate()

  if (!helpPageUrl && !schoolUrl) {
    return null
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="skeleton" size="s" className="[&&&]:shr-border-transparent">
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
