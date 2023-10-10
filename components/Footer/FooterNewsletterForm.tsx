import { useState, FC, useEffect } from 'react'
import styled from 'styled-components'
import { EmailFormFields } from 'react-mailchimp-subscribe'
import { H5, Paragraph } from '../Typography'
import { devices } from '../../utils/devices'

const Container = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.darkGreenOne};
  display: flex;
  padding: 16px 16px 8px 16px;
  border-radius: 8px;
  color: ${({ theme }) => theme.offWhite};
  flex-direction: column;
  margin-bottom: 40px;

  @media only screen and (${devices.tablet}) {
    padding: 32px 32px 16px 32px;
    margin-bottom: 80px;
  }
`

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  @media only screen and (${devices.tablet}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`

const StyledParagraph = styled(Paragraph)`
  font-family: 'Anonymous Pro';
  font-size: 14px;
  flex-grow: 1;

  @media only screen and (${devices.tablet}) {
    width: 340px;
  }
`

const StyledForm = styled.form`
  display: flex;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.midGreen};
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-grow: 1;
`

const StyledInput = styled.input`
  background: ${({ theme }) => theme.darkGreenOne};
  border: none;
  color: ${({ theme }) => theme.midGreen};
  font-size: 16px;
  font-family: 'Borna';
  width: 100%;

  ::placeholder,
  ::-webkit-input-placeholder {
    color: ${({ theme }) => theme.midGreen};
  }
  :-ms-input-placeholder {
    color: ${({ theme }) => theme.midGreen};
  }

  @media only screen and (${devices.tablet}) {
    min-width: 340px;
  }
`

const ArrowButton = styled.button`
  background: transparent;
  border: none;
  right: 0;
  cursor: pointer;
`

const EmailValidation = styled.div`
  align-items: left;
  padding-bottom: 0.5rem;
  font-weight: bold;

  @media only screen and (${devices.tablet}) {
    width: 365px;
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
      <H5>Vill du få nyheter om Klimatkollen?</H5>
      <HorizontalContainer>
        <div>
          <StyledParagraph>
            Med vårt nyhetsbrev får du uppdateringar om hur det går med utsläppen och
            omställningen direkt i din mejl.
          </StyledParagraph>
        </div>
        <div>
          <StyledForm onSubmit={handleFormSubmit}>
            {showThanks ? (
              <EmailValidation>Tack för ditt intresse!</EmailValidation>
            ) : (
              <>
                <StyledInput
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  placeholder="Ange mailadress"
                  value={email}
                  required
                  disabled={showThanks}
                  id="signup"
                />
                <ArrowButton>
                  <img src="/icons/arrow-right-bold-green.svg" alt="Arrow-icon" />
                </ArrowButton>
              </>
            )}
          </StyledForm>
        </div>
      </HorizontalContainer>
    </Container>
  )
}

export default NewsletterForm
