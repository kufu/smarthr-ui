import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'

export function useClassNames() {
  const generate = useClassNameGenerator('AppNavi')
  // AppNaviDropdown は Dropdown コンポーネントを使っているため、className はそちらで付与される
  return useMemo(
    () => ({
      wrapper: generate(),
      label: generate('label'),
      buttons: generate('buttons'),
      listItem: generate('listItem'),
      customTag: generate('customTag'),
    }),
    [generate],
  )
}
