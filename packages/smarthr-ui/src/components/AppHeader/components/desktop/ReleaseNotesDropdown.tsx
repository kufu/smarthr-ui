import { type FC, type PropsWithChildren, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Button } from '../../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { FaCaretDownIcon } from '../../../Icon'
import { Center } from '../../../Layout'
import { Loader } from '../../../Loader'
import { Text } from '../../../Text'
import { TextLink } from '../../../TextLink'
import { useTranslate } from '../../hooks/useTranslate'
import { Translate } from '../common/Translate'

import type { ReleaseNoteProps } from '../../types'

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
        <ReleaseNoteDropdownTrigger>{translated.releaseNote}</ReleaseNoteDropdownTrigger>
        <DropdownContent className="shr-mr-1.25" controllable>
          <div className="shr-w-[400px]">
            {loading ? (
              <StyledLoader />
            ) : error || !links ? (
              <LoadErrorText>{translated.loadError}</LoadErrorText>
            ) : (
              <div className={wrapperClassName}>
                {links.slice(0, 5).map(({ title, url }, index) => (
                  <ArticleLink key={index} href={url}>
                    {title}
                  </ArticleLink>
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

const ReleaseNoteDropdownTrigger = memo<PropsWithChildren>(({ children }) => (
  <DropdownTrigger>
    <Button
      suffix={<FaCaretDownIcon />}
      className="shr-border-none shr-font-normal shr-rounded-none [&[aria-expanded='true']_.smarthr-ui-Icon:last-child]:shr-rotate-180"
    >
      <Translate>{children}</Translate>
    </Button>
  </DropdownTrigger>
))

const StyledLoader = memo(() => (
  <Center className="shr-py-3">
    <Loader />
  </Center>
))

const LoadErrorText = memo<PropsWithChildren>(({ children }) => (
  <div className="shr-p-0.75 shr-whitespace-pre-wrap">
    <Text>
      <Translate>{children}</Translate>
    </Text>
  </div>
))

const ArticleLink = memo<PropsWithChildren<{ href: string }>>(({ href, children }) => (
  <div className="shr-p-0.75 shr-border-b-shorthand shr-border-dashed">
    <TextLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="shr-leading-normal [&&]:shr-underline"
      style={BOX_SHADOW_STYLE}
    >
      {children}
    </TextLink>
  </div>
))

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
