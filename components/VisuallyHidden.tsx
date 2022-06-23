import styled from 'styled-components'

// Use this component when elements are needed for a11y
// but does not fit visually in the UI.

const Hidden = styled.div`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`

export default function VisuallyHidden({ children }: { children: JSX.Element }) {
  return <Hidden>{children}</Hidden>
}
