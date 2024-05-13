import React from 'react'
import { StyleSheetManager } from 'styled-components'
import isPropValid from '@emotion/is-prop-valid'

function StyledComponentsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <StyleSheetManager shouldForwardProp={isPropValid}>
      {children}
    </StyleSheetManager>
  )
}

export default StyledComponentsWrapper
