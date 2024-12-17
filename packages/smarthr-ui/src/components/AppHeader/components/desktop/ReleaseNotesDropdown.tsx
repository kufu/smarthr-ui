import React, { FC } from 'react'
import { tv } from 'tailwind-variants'

import { Button } from '../../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { FaCaretDownIcon } from '../../../Icon'
import { Center } from '../../../Layout'
import { Loader } from '../../../Loader'
import { Text } from '../../../Text'
import { TextLink } from '../../../TextLink'
import { useTranslate } from '../../hooks/useTranslate'
import { ReleaseNoteProps } from '../../types'
import { Translate } from '../common/Translate'

const wrapper = tv({
  base: 'shr-w-[400px]',
  variants: {
    type: {
      content: '',
    },
  },
})

export const ReleaseNotesDropdown: FC<ReleaseNoteProps> = ({ indexUrl, links, loading, error }) => {
  const translate = useTranslate()

  return (
    <div className="shr-border-l-shorthand shr-ms-0.5">
      <Dropdown>
        <DropdownTrigger>
          <Button
            suffix={<FaCaretDownIcon />}
            className="shr-border-none shr-font-normal shr-rounded-none [&[aria-expanded='true']>.smarthr-ui-Icon:last-child]:shr-rotate-180"
          >
            <Translate>{translate('common/releaseNote')}</Translate>
          </Button>
        </DropdownTrigger>

        <DropdownContent className="shr-mr-1.25" controllable>
          <div className="shr-w-[400px]">
            {loading ? (
              <Center className="shr-py-3">
                <Loader />
              </Center>
            ) : error || !links ? (
              <div className="shr-p-0.75 shr-whitespace-pre-wrap">
                <Text>
                  <Translate>{translate('common/releaseNotesLoadError')}</Translate>
                </Text>
              </div>
            ) : (
              <div className={wrapper()}>
                {links.slice(0, 5).map(({ title, url }, index) => (
                  <div key={index} className="shr-p-0.75 shr-border-b-shorthand shr-border-dashed">
                    <TextLink
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shr-leading-normal [&&]:shr-underline"
                      style={{ boxShadow: 'none' }}
                    >
                      {title}
                    </TextLink>
                  </div>
                ))}

                <div className="shr-p-0.75 shr-text-right">
                  <TextLink
                    href={indexUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shr-leading-normal [&&]:shr-underline"
                    style={{ boxShadow: 'none' }}
                  >
                    <Translate>{translate('common/seeAllReleaseNotes')}</Translate>
                  </TextLink>
                </div>
              </div>
            )}
          </div>
        </DropdownContent>
      </Dropdown>
    </div>
  )
}
