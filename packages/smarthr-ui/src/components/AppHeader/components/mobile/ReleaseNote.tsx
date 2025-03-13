import React, { type FC, useContext } from 'react'
import { tv } from 'tailwind-variants'

import { FaUpRightFromSquareIcon } from '../../../Icon'
import { Center, Stack } from '../../../Layout'
import { Loader } from '../../../Loader'
import { Text } from '../../../Text'
import { useTranslate } from '../../hooks/useTranslate'
import { Translate } from '../common/Translate'

import { ReleaseNoteContext } from './ReleaseNoteContext'

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

export const ReleaseNote: FC = () => {
  const translate = useTranslate()
  const { releaseNote } = useContext(ReleaseNoteContext)

  if (!releaseNote) {
    return null
  }

  const { anchor, icon, indexLinkWrapper, indexLinkAnchor } = releaseNoteStyle()

  return (
    <div>
      {releaseNote.loading ? (
        <Center>
          <Loader />
        </Center>
      ) : releaseNote.error ? (
        <Text>
          <Translate>{translate('common/releaseNotesLoadError')}</Translate>
        </Text>
      ) : (
        <Stack>
          {releaseNote.links.slice(0, 5).map((link) => (
            <div key={link.url}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className={anchor()}>
                {link.title}
                <FaUpRightFromSquareIcon className={icon()} />
              </a>
            </div>
          ))}
        </Stack>
      )}

      <div className={indexLinkWrapper()}>
        <a
          href={releaseNote.indexUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={indexLinkAnchor()}
        >
          <Translate>{translate('common/seeAllReleaseNotes')}</Translate>
          <FaUpRightFromSquareIcon className={icon()} />
        </a>
      </div>
    </div>
  )
}
