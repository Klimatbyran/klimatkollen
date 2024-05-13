import React from 'react'
import { StyleSheetManager } from 'styled-components'
import isPropValid from '@emotion/is-prop-valid'

/**
 * Make sure styled-components only render valid props to the DOM.
 */
function StyledComponentsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <StyleSheetManager shouldForwardProp={isPropValid}>
      {children}
    </StyleSheetManager>
  )
}

export default StyledComponentsWrapper
