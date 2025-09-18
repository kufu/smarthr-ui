import { type FC, memo, useContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../../intl'
import { FaUpRightFromSquareIcon } from '../../../Icon'
import { Center, Stack } from '../../../Layout'
import { Loader } from '../../../Loader'
import { Text } from '../../../Text'
import { Translate } from '../common/Translate'

import { ReleaseNoteContext } from './ReleaseNoteContext'

import type { HeaderProps } from '../../types'

const classNameGenerator = tv({
  slots: {
    anchor: ['shr-text-base shr-text-link [&&]:shr-underline', '[&&]:hover:shr-no-underline'],
    icon: ['shr-ms-0.5'],
    indexLinkWrapper: ['shr-mt-2 shr-text-end'],
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
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={classNames.anchor}
              >
                {link.title}
                <FaUpRightFromSquareIcon className={classNames.icon} alt="別タブで開く" />
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
          <FaUpRightFromSquareIcon className={classNames.icon} alt="別タブで開く" />
        </a>
      </div>
    </div>
  )
}
