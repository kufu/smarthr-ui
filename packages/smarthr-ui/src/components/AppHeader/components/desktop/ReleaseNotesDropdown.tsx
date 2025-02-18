import React, { type FC, type PropsWithChildren, memo, useMemo } from 'react'
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

const wrapperClassNameGenerator = tv({
  base: 'shr-w-[400px]',
  variants: {
    type: {
      content: '',
    },
  },
})

const BOX_SHADOW_STYLE = { boxShadow: 'none' }

export const ReleaseNotesDropdown: FC<ReleaseNoteProps> = ({ indexUrl, links, loading, error }) => {
  const wrapperClassName = useMemo(() => wrapperClassNameGenerator(), [])

  const translate = useTranslate()
  const translated = useMemo(
    () => ({
      releaseNote: translate('common/releaseNote'),
      loadError: translate('common/releaseNotesLoadError'),
      seeAll: translate('common/seeAllReleaseNotes'),
    }),
    [translate],
  )

  return (
    <div className="shr-border-l-shorthand shr-ms-0.5">
      <Dropdown>
        <DropdownTrigger>
          <Button
            suffix={<FaCaretDownIcon />}
            className="shr-border-none shr-font-normal shr-rounded-none [&[aria-expanded='true']>.smarthr-ui-Icon:last-child]:shr-rotate-180"
          >
            <Translate>{translated.releaseNote}</Translate>
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
                  <Translate>{translated.loadError}</Translate>
                </Text>
              </div>
            ) : (
              <div className={wrapperClassName}>
                {links.slice(0, 5).map(({ title, url }, index) => (
                  <div key={index} className="shr-p-0.75 shr-border-b-shorthand shr-border-dashed">
                    <TextLink
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shr-leading-normal [&&]:shr-underline"
                      style={BOX_SHADOW_STYLE}
                    >
                      {title}
                    </TextLink>
                  </div>
                ))}
                <SeeAllTextLink href={indexUrl}>{translated.seeAll}</SeeAllTextLink>
              </div>
            )}
          </div>
        </DropdownContent>
      </Dropdown>
    </div>
  )
}

const SeeAllTextLink = memo<PropsWithChildren<{ href: string }>>(({ href, children }) => (
  <div className="shr-p-0.75 shr-text-right">
    <TextLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="shr-leading-normal [&&]:shr-underline"
      style={BOX_SHADOW_STYLE}
    >
      <Translate>{children}</Translate>
    </TextLink>
  </div>
))
