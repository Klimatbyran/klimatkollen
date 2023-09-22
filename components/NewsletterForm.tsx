import { useState, FC, useEffect } from 'react'
import styled from 'styled-components'
import { EmailFormFields } from 'react-mailchimp-subscribe'
import { ParagraphBold } from './Typography'
import { devices } from '../utils/devices'
import Button from './Button'

const Container = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.lightBlack};
  display: flex;
  padding: 16px;
  border-radius: 8px;
  color: ${({ theme }) => theme.black};
  gap: 1.5rem;
  flex-direction: column;
`

const ParagraphBoldGreen = styled(ParagraphBold)`
  color: ${({ theme }) => theme.midGreen};
  padding: 0;
  margin: 0;
`

const StyledForm = styled.form`
  display: flex;
  gap: 1.5rem;
  flex-direction: column;

  @media only screen and (${devices.tablet}) {
    flex-direction: row;
  }
`

const StyledInput = styled.input`
  height: 55px;
  border: 1px solid ${({ theme }) => theme.midGreen};
  background: ${({ theme }) => theme.lightBlack};
  border-radius: 5px;
  padding: 15px;
  color: ${({ theme }) => theme.offWhite};
  font-size: 16px;
  font-family: 'Borna';

  ::placeholder,
  ::-webkit-input-placeholder {
    color: ${({ theme }) => theme.offWhite};
  }
  :-ms-input-placeholder {
    color: ${({ theme }) => theme.offWhite};
  }

  @media only screen and (${devices.tablet}) {
    min-width: 400px;
  }
`

const EmailValidation = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.darkGreenOne};
  height: 56px;
  border-radius: 4px;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;

  span {
    font-weight: bold;
    font-size: 16px;
    display: block;
    flex-grow: 1;
    text-align: center;
  }
`

type Props = {
  status: 'sending' | 'error' | 'success' | null
  onValidated: (value: EmailFormFields) => void
}

// fixme revisit, remove exception and refactor
// eslint-disable-next-line react/function-component-definition
const NewsletterForm: FC<Props> = ({ status, onValidated }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [showThanks, setThanks] = useState(false)

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      setThanks(true)
      setTimeout(() => {
        setThanks(false)
        setEmail('')
      }, 3000)
    }
  }, [status])

  const handleFormSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!email) {
      setError('Vänligen fyll i en giltig e-postadress.')
      return null
    }

    const isFormValidated = onValidated({ EMAIL: email })

    return email && email.indexOf('@') > -1 && isFormValidated
  }

  return (
    <Container>
      <ParagraphBoldGreen>Vill du få nyheter om Klimatkollen?</ParagraphBoldGreen>
      {/* <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Paragraph> */}
      <StyledForm onSubmit={handleFormSubmit}>
        <StyledInput
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="Ange mailadress"
          value={email}
          required
          disabled={showThanks}
          id="signup"
        />
        {showThanks ? (
          <EmailValidation>
            <span>Tack för din intresseanmälan!</span>
          </EmailValidation>
        ) : (
          <Button text="Skicka" />
        )}
      </StyledForm>
    </Container>
  )
}

export default NewsletterForm
