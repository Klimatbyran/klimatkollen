import styled from 'styled-components'
import { ParagraphSmall } from './Typography'
import Button from './Button'
import { devices } from '../utils/devices'

const StyledForm = styled.form`
  background: transparent;
  height: 50px;
  border: 1px solid ${({ theme }) => theme.white};
  border-radius: 5px;
  padding: 15px;
  max-width: 400px;
  min-width: 350px;
`

const Container = styled.div`
  display: flex;
  gap: 0.7rem;
  flex-direction: column;

  @media only screen and (${devices.tablet}) {
    flex-direction: row;
    gap: 1.5rem;
  }
`

const NewsletterForm = () => {
  const handleClick = () => {
    alert('Clicked the button')
  }

  return (
    <Container>
      <StyledForm id="newsletter-form">
        <ParagraphSmall>E-postadress</ParagraphSmall>
      </StyledForm>

      <Button handleClick={handleClick} text="Skicka intresseanmälan" />
    </Container>
  )
}

export default NewsletterForm
