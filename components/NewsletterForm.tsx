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
    color: ${({ theme }) => theme.white};
  }
  :-ms-input-placeholder {
     color: ${({ theme }) => theme.white};
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

  const [form, setForm] = useState('');
  const [showConfirmationText, setShowConfirmationText] = useState(false)

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setShowConfirmationText(false)
    setForm(e.currentTarget.value)
    console.log(form)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    console.log("E-postadress: " + form)
    setForm('')
    setShowConfirmationText(true)
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
      {showConfirmationText && <p>Tack, din e-postadress är registrerad!</p>}
      <Button handleClick={handleSubmit} text="Skicka intresseanmälan" />
    </Container>
  )
}

export default NewsletterForm
