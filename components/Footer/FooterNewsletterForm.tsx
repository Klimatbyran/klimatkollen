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
  margin: 0 auto 40px;
  max-width: 500px;

  @media only screen and (${devices.tablet}) {
    padding: 32px 32px 16px 32px;
    margin-bottom: 80px;
    max-width: unset;
  }
`

const HorizontalContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding-bottom: 1rem;

  @media screen and (${devices.tablet}) {
    grid-template-columns: 1fr 1fr;
    padding: 0;
  }
`

const StyledParagraph = styled(Paragraph)`
  font-family: 'Anonymous Pro';
  font-size: 16px;
`

const PrivacyInfo = styled(StyledParagraph)`
  font-size: 14px;
`

const StyledForm = styled.form`
  --form-height: 40px;

  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  align-self: center;
  justify-self: center;
  max-width: 400px;
  background: white;
  border-radius: 4px;
  height: var(--form-height);
  color: ${({ theme }) => theme.black};
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
  border: none;
  font-size: 16px;
  font-family: Borna;
  width: 100%;
  padding: 0.5rem;
  background: transparent;
  height: var(--form-height);

  ::placeholder,
  ::-webkit-input-placeholder {
    color: ${({ theme }) => theme.black};
  }
  :-ms-input-placeholder {
    color: ${({ theme }) => theme.black};
  }
`

const ArrowButton = styled.button`
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--form-height);
  border: none;
  cursor: pointer;
  padding: 0.25rem;
`

const EmailValidation = styled.div`
  align-items: left;
  padding-left: 0.5rem;
  font-weight: bold;
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
        <StyledParagraph>
          {t('common:footer.signup-form.info')}
        </StyledParagraph>
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
      </HorizontalContainer>

      <Markdown components={{ p: PrivacyInfo }}>{t('common:footer.privacyInfo')}</Markdown>
    </Container>
  )
}

export default NewsletterForm
