import { useState, FC, useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'next-i18next'
import { EmailFormFields } from 'react-mailchimp-subscribe'

import { H5, Paragraph } from '../Typography'
import { devices } from '../../utils/devices'
import Markdown from '../Markdown'

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
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  margin: 1rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.midGreen};
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-grow: 1;
`

const VisuallyHiddenLabel = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`

const StyledInput = styled.input`
  background: ${({ theme }) => theme.darkGreenOne};
  border: none;
  color: ${({ theme }) => theme.midGreen};
  font-size: 16px;
  font-family: 'Borna';
  width: 100%;
  padding: 0.5rem;

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
  padding: 0.25rem;
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
  const { t } = useTranslation()

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
    <Container id="newsletter">
      <H5>{t('common:footer.signup-form.title')}</H5>
      <HorizontalContainer>
        <div>
          <StyledParagraph>
            {t('common:footer.signup-form.info')}
          </StyledParagraph>
        </div>
        <div>
          <StyledForm onSubmit={handleFormSubmit}>
            {showThanks ? (
              <EmailValidation>{t('common:footer.signup-form.thanks')}</EmailValidation>
            ) : (
              <>
                <VisuallyHiddenLabel htmlFor="signup">{t('common:footer.signup-form.label')}</VisuallyHiddenLabel>
                <StyledInput
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  placeholder={t('common:footer.signup-form.placeholder')}
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

        <Markdown components={{ p: StyledParagraph }}>{t('common:footer.privacyInfo')}</Markdown>
      </HorizontalContainer>
    </Container>
  )
}

export default NewsletterForm
