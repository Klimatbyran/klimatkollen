import router from 'next/router'
import styled from 'styled-components'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import { H1 } from '../components/Typography'

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`

const Button = styled.button`
  height: 56px;
  background: ${({ theme }) => theme.midGreen};
  border: 0;
  border-radius: 4px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  &:hover {
    background: ${({ theme }) => theme.lightGreen};
  }
`

function FourOhFour() {
  const handleClick = () => {
    router.push('/')
  }

  return (
    <Wrapper>
      <H1>500 - Något gick fel!</H1>
      <Button onClick={handleClick}>Gå till startsidan</Button>
    </Wrapper>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale as string, ['common']),
  },
})

export default FourOhFour
