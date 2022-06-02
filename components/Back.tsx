import styled from 'styled-components'
import Icon from '../public/icons/arrow-left.svg'
import Link from 'next/link'

const A = styled.a`
  border: 0;
  cursor: pointer;
  fill: #fff;
  background: transparent;
  align-self: flex-start;
`

const BackArrow = ({ route }: { route: string }) => {
  return (
    <Link href={route}>
      <A aria-label="Gå tillbaka">
        <Icon aria-hidden="true" />
      </A>
    </Link>
  )
}

export default BackArrow
