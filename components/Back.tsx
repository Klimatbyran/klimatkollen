import styled from 'styled-components'
import Icon from '../public/icons/arrow-left.svg'
import Link from 'next/link'

const Button = styled.button`
  border: 0;
  cursor: pointer;
  fill: #fff;
  background: transparent;
  align-self: flex-start;
`

const BackArrow = () => {
  return (
    <Link href="/">
      <Button type="button">
        <a href="/">
          <Icon />
        </a>
      </Button>
    </Link>
  )
}

export default BackArrow
