import styled from 'styled-components'
import Link from 'next/link'
import ArrowLeftIcon from '../public/icons/arrow-left.svg'

const StyledButton = styled.button`
  border: none;
  cursor: pointer;
  background-color: transparent;
  width: 60px;
  text-align: left;
`

type BackArrowProps = {
  route: string
}

function BackArrow({ route }: BackArrowProps) {
  return (
    <Link href={route} legacyBehavior>
      <StyledButton>
        <a href={route}>
          <ArrowLeftIcon />
        </a>
      </StyledButton>
    </Link>
  )
}

export default BackArrow
