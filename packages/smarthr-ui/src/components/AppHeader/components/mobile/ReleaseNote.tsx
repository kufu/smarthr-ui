import { type FC, memo, useContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../../intl'
import { OpenInNewTabIcon } from '../../../Icon'
import { Center, Stack } from '../../../Layout'
import { Loader } from '../../../Loader'
import { Text } from '../../../Text'
import { TextLink } from '../../../TextLink'
import { Translate } from '../common/Translate'

import { ReleaseNoteContext } from './ReleaseNoteContext'

import type { HeaderProps } from '../../types'

const classNameGenerator = tv({
  slots: {
    anchor: [
      'shr-text-base shr-text-link shr-shadow-none [&&]:shr-underline',
      '[&&]:hover:shr-no-underline',
    ],
    icon: ['shr-ms-0.5'],
    indexLinkWrapper: ['shr-mt-2 shr-text-end'],
    indexLinkAnchor: [
      'shr-text-base shr-text-link shr-shadow-none [&&]:shr-no-underline',
      '[&&]:hover:shr-underline',
    ],
  },
})

export const ReleaseNote = memo(() => {
  const { releaseNote } = useContext(ReleaseNoteContext)

  return releaseNote ? <ActualReleaseNote data={releaseNote} /> : null
})

const ActualReleaseNote: FC<{
  data: Exclude<Required<HeaderProps>['releaseNote'], null>
}> = ({ data }) => {
  const { localize } = useIntl()
  const translated = useMemo(
    () => ({
      error: localize({
        id: 'smarthr-ui/AppHeader/releaseNotesLoadError',
        defaultText: 'リリースノートの読み込みに失敗しました。\n時間をおいて、やり直してください。',
      }),
      seeAll: localize({
        id: 'smarthr-ui/AppHeader/seeAllReleaseNotes',
        defaultText: 'すべてのリリースノートを見る',
      }),
    }),
    [localize],
  )

  const classNames = useMemo(() => {
    const { anchor, icon, indexLinkWrapper, indexLinkAnchor } = classNameGenerator()

    return {
      anchor: anchor(),
      icon: icon(),
      indexLinkWrapper: indexLinkWrapper(),
      indexLinkAnchor: indexLinkAnchor(),
    }
  }, [])

  return (
    <div>
      {data.loading ? (
        <Center>
          <Loader />
        </Center>
      ) : data.error ? (
        <Text>
          <Translate>{translated.error}</Translate>
        </Text>
      ) : (
        <Stack>
          {data.links.slice(0, 5).map((link) => (
            <div key={link.url}>
              <TextLink
                href={link.url}
                target="_blank"
                rel="noopener"
                referrerPolicy="no-referrer-when-downgrade"
                className={classNames.anchor}
                suffix={<OpenInNewTabIcon className={classNames.icon} />}
              >
                {link.title}
              </TextLink>
            </div>
          ))}
        </Stack>
      )}

      <div className={classNames.indexLinkWrapper}>
        <TextLink
          href={data.indexUrl}
          target="_blank"
          rel="noopener"
          referrerPolicy="no-referrer-when-downgrade"
          className={classNames.indexLinkAnchor}
          suffix={<OpenInNewTabIcon className={classNames.icon} />}
        >
          <Translate>{translated.seeAll}</Translate>
        </TextLink>
      </div>
    </div>
  )
}
