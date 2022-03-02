import { useState, FC, useEffect } from 'react'
import { decode } from 'html-entities'
import Button from './Button'
import styled from 'styled-components'
import { devices } from '../utils/devices'
import { EmailFormFields } from 'react-mailchimp-subscribe'

const StyledForm = styled.form`
  display: flex;
  gap: 1.5rem;
  flex-direction: column;

  @media only screen and (${devices.tablet}) {
    flex-direction: row;
  }
`

const StyledInput = styled.input`
  background: transparent;
  height: 55px;
  border: 1px solid ${({ theme }) => theme.white};
  border-radius: 5px;
  padding: 15px;
  color: ${({ theme }) => theme.white};
  font-size: 16px;
  font-family: Helvetica Neue;

  ::placeholder,
  ::-webkit-input-placeholder {
    color: ${({ theme }) => theme.white};
  }
  :-ms-input-placeholder {
    color: ${({ theme }) => theme.white};
  }

  @media only screen and (${devices.tablet}) {
    min-width: 400px;
  }

`

const Container = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-direction: column;
`

const EmailValidation = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.darkGreen};
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
  message: string | Error | null
  onValidated: (value: EmailFormFields) => void
}

const NewsletterForm: FC<Props> = ({ status, message, onValidated }) => {
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

  const getMessage = (message: string) => {
    if (!message) {
      return null
    }
    const result = message?.split('-') ?? null
    if ('0' !== result?.[0]?.trim()) {
      return decode(message)
    }
    const formattedMessage = result?.[1]?.trim() ?? null
    return formattedMessage ? decode(formattedMessage) : null
  }

  return (
    <Container>
      <StyledForm onSubmit={handleFormSubmit}>
        <StyledInput
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="E-postadress"
          value={email}
          required
          disabled={showThanks}
        />
        {showThanks ? (
          <EmailValidation>
            <span>Tack för din intresseanmälan!</span>
          </EmailValidation>
        ) : (
          <Button text={'Skicka intresseanmälan'} />
        )}
      </StyledForm>
      {status === 'sending'}
      {status === 'error' || error ? (
        <div
          dangerouslySetInnerHTML={{ __html: error ?? getMessage(message as string) }}
        />
      ) : null}
    </Container>
  )
}

export default NewsletterForm
