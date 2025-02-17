import React, { type FC, memo, useContext } from 'react'
import { tv } from 'tailwind-variants'

import { FaUpRightFromSquareIcon } from '../../../Icon'
import { Center, Stack } from '../../../Layout'
import { Loader } from '../../../Loader'
import { Text } from '../../../Text'
import { useTranslate } from '../../hooks/useTranslate'
import { HeaderProps } from '../../types'
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

export const ReleaseNote = memo(() => {
  const { releaseNote } = useContext(ReleaseNoteContext)

  return releaseNote ? <ActualReleaseNote data={releaseNote} /> : null
})

const ActualReleaseNote: FC<{
  data: HeaderProps['releaseNote']
}> = () => {
  const translate = useTranslate()
  const { anchor, icon, indexLinkWrapper, indexLinkAnchor } = releaseNoteStyle()

  return (
    <div>
      {data.loading ? (
        <Center>
          <Loader />
        </Center>
      ) : data.error ? (
        <Text>
          <Translate>{translate('common/releaseNotesLoadError')}</Translate>
        </Text>
      ) : (
        <Stack>
          {data.links.slice(0, 5).map((link) => (
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
          href={data.indexUrl}
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
