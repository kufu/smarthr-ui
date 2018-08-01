import * as React from 'react'
import * as PropTypes from 'prop-types'

import { merge } from './lodash'

export const extendDefaultPropTypes = <P>(
  propTypes: React.ValidationMap<P>,
): React.ValidationMap<P> =>
  merge(
    {
      theme: PropTypes.object,
      style: PropTypes.object,
      children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    },
    propTypes,
  )
