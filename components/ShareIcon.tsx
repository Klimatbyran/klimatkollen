import styled from 'styled-components'
import Icon from '../public/icons/share.svg'

const StyledShareIcon = styled.button`
  fill: ${({ theme }) => theme.main};
  background: transparent;
  border: 0;

  &:hover {
    cursor: pointer;
  }
`

type ShareIconProps = {
    handleClick: () => void
  }

const ShareIcon = ({ handleClick }: ShareIconProps) => {
  return (
    <StyledShareIcon type="button" onClick={handleClick}>
      <Icon />
    </StyledShareIcon>
  )
}

export default ShareIcon
