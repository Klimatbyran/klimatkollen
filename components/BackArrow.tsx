import styled from 'styled-components'
import Link from 'next/link'
import ArrowLeftIcon from '../public/icons/arrow-left.svg'

const StyledButton = styled.button`
  border: none;
  cursor: pointer;
  background-color: transparent;
  align-self: flex-start;
`

type BackArrowProps = {
  route: string
}

const BackArrow = ({ route }: BackArrowProps) => (
  <Link href={route}>
    <StyledButton>
      <a href={route}>
        <ArrowLeftIcon />
      </a>
    </StyledButton>
  </Link>
)

export default BackArrow
