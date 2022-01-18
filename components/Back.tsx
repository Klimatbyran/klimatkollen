import styled from 'styled-components'
import Icon from '../public/icons/arrow-left.svg';
import Link from 'next/link'

const Button = styled.button`
  border: 0;
  cursor: pointer;
  fill: #fff;
  background: transparent;
`;

const BackArrow = () => {
  return (
    <Link href="/">
      <Button type="button">
        <Icon />
      </Button>
    </Link>
  )
}

export default BackArrow