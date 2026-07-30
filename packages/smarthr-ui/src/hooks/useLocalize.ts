import { useMemo } from 'react'

import { useIntl } from '../intl'

type LocalizeProps = Parameters<ReturnType<typeof useIntl>['localize']>[0]

export const useLocalize = (props: { [key: string]: LocalizeProps }) => {
  const { localize } = useIntl()

  const localized = useMemo(() => {
    const result: { [key: string]: string } = {}

    for (const i in props) {
      result[i] = localize(props[i])
    }

    return result
    // HINT: 利用方法としてpropsはliteral objectになる
    // 依存配列からは意図的に排除している
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localize])

  return localized
}
