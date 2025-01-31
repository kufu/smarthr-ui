import React, { FC, useContext } from 'react'
import { tv } from 'tailwind-variants'

import { FaUpRightFromSquareIcon } from '../../../Icon'
import { Center, Stack } from '../../../Layout'
import { Loader } from '../../../Loader'
import { Text } from '../../../Text'
import { useTranslate } from '../../hooks/useTranslate'
import { Translate } from '../common/Translate'

import { ReleaseNoteContext } from './ReleaseNoteContext'
import { HeaderProps } from '../../types'

const releaseNoteStyle = tv({
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

export const ReleaseNote = React.memo(() => {
  const { releaseNote } = useContext(ReleaseNoteContext)

  return releaseNote ? <ActualReleaseNote releaseNote={releaseNote} /> : null
})

const ActualReleaseNote: FC<{ releaseNote: HeaderProps['releaseNote'] }> = ({ releaseNote }) => {
  const styles = useMemo(() => {
    const { anchor, icon, indexLinkWrapper, indexLinkAnchor } = releaseNoteStyle()

    return {
      anchor: anchor(),
      icon: icon(),
      indexLinkWrapper: indexLinkWrapper(),
      indexLinkAnchor: indexLinkAnchor(),
    }
  }, [])

  const translate = useTranslate()
  const translated = useMemo(
    () => ({
      loadError: translate('common/releaseNotesLoadError'),
      seeAll: translate('common/seeAllReleaseNotes'),
    }),
    [translate],
  )

  return (
    <div>
      {releaseNote.loading ? (
        <Center>
          <Loader />
        </Center>
      ) : releaseNote.error ? (
        <Text>
          <Translate>{translated.loadError}</Translate>
        </Text>
      ) : (
        <Stack>
          {releaseNote.links.slice(0, 5).map((link) => (
            <div key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.anchor}
              >
                {link.title}
                <FaUpRightFromSquareIcon className={styles.icon} />
              </a>
            </div>
          ))}
        </Stack>
      )}

      <IndexLink href={releaseNote.indexUrl} styles={styles}>
        {translated.seeAll}
      </IndexLink>
    </div>
  )
}

const IndexLink = React.memo<{
  styles: {
    indexLinkWrapper: string
    indexLinkAnchor: string
    icon: string
  }
  href: string
  children: string
}>(({ href, styles, children }) => (
  <div className={styles.indexLinkWrapper}>
    <a href={href} target="_blank" rel="noopener noreferrer" className={styles.indexLinkAnchor}>
      <Translate>{children}</Translate>
      <FaUpRightFromSquareIcon className={styles.icon} />
    </a>
  </div>
))
