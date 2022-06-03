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

const BackArrow = ({ route }: { route: string }) => {
  return (
    <Link href={route}>
      <Button type="button">
        <a href={route}>
          <Icon />
        </a>
      </Button>
    </Link>
  )
}

export default BackArrow
