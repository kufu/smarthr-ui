import React, { FC } from 'react'

import { Button } from '../../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { FaCircleQuestionIcon, FaGraduationCapIcon } from '../../../Icon'
import { Localizer } from '../../../../intl/Localizer'
import { CommonButton } from '../common/CommonButton'

type Props = {
  helpPageUrl?: string | null
  schoolUrl?: string | null
}

export const Help: FC<Props> = ({ helpPageUrl, schoolUrl }) => {
  if (!helpPageUrl && !schoolUrl) {
    return null
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="skeleton" size="s" square className="[&&&]:shr-border-transparent">
          <FaCircleQuestionIcon role="img" aria-label="ヘルプ" />
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
              <Localizer id="smarthr-ui/AppHeader/help" defaultText="ヘルプ" values={{}} />
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
              <Localizer id="smarthr-ui/AppHeader/school" defaultText="スクール" values={{}} />
            </CommonButton>
          )}
        </div>
      </DropdownContent>
    </Dropdown>
  )
}
