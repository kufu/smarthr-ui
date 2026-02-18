import { type FC, memo, useContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../../intl'
import { OpenInNewTabIcon } from '../../../Icon'
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

// HelpLinkではなく<a>タグ（TextLinkに相当）を使用する理由:
// - リリースノートは典型的なヘルプコンテンツではない
// - rel="help"はW3C定義で「親要素とその子要素のための追加のヘルプ情報」を指すが、
//   AppHeaderからのリリースノートは現在のページと直接関連するとは限らない
// 参考: https://www.w3.org/TR/2010/WD-html5-20100624/links.html#link-type-help
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
                referrerPolicy="no-referrer-when-downgrade"
                className={classNames.anchor}
              >
                {link.title}
                <OpenInNewTabIcon className={classNames.icon} />
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
          referrerPolicy="no-referrer-when-downgrade"
          className={classNames.indexLinkAnchor}
        >
          <Translate>{translated.seeAll}</Translate>
          <OpenInNewTabIcon className={classNames.icon} />
        </a>
      </div>
    </div>
  )
}
