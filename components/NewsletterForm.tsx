import styled from 'styled-components'
import Button from './Button'
import { devices } from '../utils/devices'
import { useState } from 'react'

const StyledForm = styled.input`
  background: transparent;
  height: 50px;
  border: 1px solid ${({ theme }) => theme.white};
  border-radius: 5px;
  padding: 15px;
  max-width: 400px;
  min-width: 350px;
  color: #fff;
  font-size: 16px;
  font-family: Helvetica Neue;

  ::placeholder,
  ::-webkit-input-placeholder {
    color: ${({ theme }) => theme.white}
  }
  :-ms-input-placeholder {
    color: ${({ theme }) => theme.white}
  }
`

const Container = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-direction: column;
  width: 300px;

  @media only screen and (${devices.tablet}) {
    flex-direction: row;
    width: 100%;
  }
`

// TO DO: Fix button size on desktop

const NewsletterForm = () => {

  const [form, setForm] = useState('')
  const [validateEmail, setValidateEmail] = useState('')

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setValidateEmail('')
    setForm(e.currentTarget.value)
  }

  const handleSubmit = (e: any) => {

    const regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')

    if (regex.test(form) === true) {
      e.preventDefault()
      console.log("E-postadress: " + form) // Skicka sparad e-postadress till MailChimp
      setValidateEmail("Tack, din e-postadress är registrerad.")
      setForm('')
    } else {
      setValidateEmail("Vänligen ange en korrekt e-postadress.")
    }
  }

  return (
    <Container>
      <StyledForm 
        id="email" 
        type="email" 
        name="email"
        value={form}
        placeholder="E-postadress"
        onChange={handleChange} 
      />
      {validateEmail}
      <Button handleClick={handleSubmit} text="Skicka intresseanmälan" />
    </Container>
  )
}

export default NewsletterForm