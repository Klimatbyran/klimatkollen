import React from 'react'
import { StyleSheetManager } from 'styled-components'
import isPropValid from '@emotion/is-prop-valid'

import Theme from '../../Theme'

/**
 * Make sure styled-components only render valid props to the DOM.
 */
function StyledComponentsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <StyleSheetManager shouldForwardProp={isPropValid}>
      <Theme>
        {children}
      </Theme>
    </StyleSheetManager>
  )
}

export default StyledComponentsWrapper
