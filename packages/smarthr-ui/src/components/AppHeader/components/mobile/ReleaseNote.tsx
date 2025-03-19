import { type FC, memo, useContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { FaUpRightFromSquareIcon } from '../../../Icon'
import { Center, Stack } from '../../../Layout'
import { Loader } from '../../../Loader'
import { Text } from '../../../Text'
import { useTranslate } from '../../hooks/useTranslate'
import { Translate } from '../common/Translate'

import { ReleaseNoteContext } from './ReleaseNoteContext'

import type { HeaderProps } from '../../types'

const classNameGenerator = tv({
  slots: {
    anchor: ['shr-text-base shr-text-link [&&]:shr-underline', '[&&]:hover:shr-no-underline'],
    icon: ['shr-ms-0.5'],
    indexLinkWrapper: ['shr-text-end shr-mt-2'],
    indexLinkAnchor: [
      'shr-text-base shr-text-link [&&]:shr-no-underline',
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
  const translate = useTranslate()
  const translated = useMemo(
    () => ({
      error: translate('common/releaseNotesLoadError'),
      seeAll: translate('common/seeAllReleaseNotes'),
    }),
    [translate],
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
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={classNames.anchor}
              >
                {link.title}
                <FaUpRightFromSquareIcon className={classNames.icon} />
              </a>
            </div>
          ))}
        </Stack>
      )}

      <div className={classNames.indexLinkWrapper}>
        <a
          href={data.indexUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={classNames.indexLinkAnchor}
        >
          <Translate>{translated.seeAll}</Translate>
          <FaUpRightFromSquareIcon className={classNames.icon} />
        </a>
      </div>
    </div>
  )
}
