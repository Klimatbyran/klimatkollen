import { useState } from 'react'
import { decode } from 'html-entities'
import Button from './Button'
import styled from 'styled-components'
import { devices } from '../utils/devices'
import MailchimpSubscribe from 'react-mailchimp-subscribe'

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
const NewsletterForm = ( { status, message, onValidated }) => {

  const [ error, setError ] = useState(null)
  const [ email, setEmail ] = useState(null)

  /**
   * Handle form submit.
   *
   * @return {{value}|*|boolean|null}
   */
  const handleFormSubmit = () => {

    setError(null)

    if ( ! email ) {
      setError( 'Vänligen fyll i en giltig e-postadress.' )
      return null
    }

    const isFormValidated = onValidated({ EMAIL: email })

    // On success return true
    return email && email.indexOf("@") > -1 && isFormValidated
  }

  /**
   * Handle Input Key Event.
   *
   * @param event
   */
  const handleInputKeyEvent = ( event: any ) => {
    setError(null)
    if (event.keyCode === 13) {
      event.preventDefault();
      handleFormSubmit()
    }
  }

  /**
   * Extract message from string.
   *
   * @param {String|any} message
   * @return {null|*}
   */
  const getMessage = (message: any) => {
    if ( !message ) {
     return null;
    }
    const result = message?.split('-') ?? null;
    if ( "0" !== result?.[0]?.trim() ) {
     return decode(message);
    }
    const formattedMessage = result?.[1]?.trim() ?? null;
    return formattedMessage ? decode( formattedMessage ) : null;
  }

  return (
    <Container>
      <div className="d-flex newsletter-input-fields">
        <div className="mc-field-group">
          <StyledForm
            onChange={(event) => setEmail(event?.target?.value ?? '')}
            type="email"
            placeholder="Din e-postadress"
            className="mr-2"
            onKeyUp={(event) => handleInputKeyEvent(event)}
          />
        </div>
        <div className="button-wrap wp-block-button">
        <Button handleClick={handleFormSubmit} text="Skicka intresseanmälan" />
        </div>
      </div>
      <div className="newsletter-form-info">
        {status === "sending" && <div>Skickar...</div>}
        {status === "error" || error ? (
          <div
            className="newsletter-form-error"
            dangerouslySetInnerHTML={{ __html: error || getMessage( message ) }}
          />
        ) : null }
        {status === "success" && status !== "error" && !error && (
          <div dangerouslySetInnerHTML={{ __html: decode(message) }} />
        )}
      </div>
    </Container>
  )
}

export default NewsletterForm




// export default NewsletterForm

// // import styled from 'styled-components'
// // import Button from './Button'
// // import { devices } from '../utils/devices'
// // import { useState } from 'react'

// // const StyledForm = styled.input`
// //   background: transparent;
// //   height: 50px;
// //   border: 1px solid ${({ theme }) => theme.white};
// //   border-radius: 5px;
// //   padding: 15px;
// //   max-width: 400px;
// //   min-width: 350px;
// //   color: #fff;
// //   font-size: 16px;
// //   font-family: Helvetica Neue;

// //   ::placeholder,
// //   ::-webkit-input-placeholder {
// //     color: ${({ theme }) => theme.white}
// //   }
// //   :-ms-input-placeholder {
// //     color: ${({ theme }) => theme.white}
// //   }
// // `

// // const Container = styled.div`
// //   display: flex;
// //   gap: 1.5rem;
// //   flex-direction: column;
// //   width: 300px;

// //   @media only screen and (${devices.tablet}) {
// //     flex-direction: row;
// //     width: 100%;
// //   }
// // `

// // // TO DO: Fix button size on desktop

// // const NewsletterForm = () => {

// //   const [form, setForm] = useState('')
// //   const [validateEmail, setValidateEmail] = useState('')

// //   const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
// //     setValidateEmail('')
// //     setForm(e.currentTarget.value)
// //   }

// //   const handleSubmit = (e: any) => {

// //     const regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}')

// //     if (regex.test(form) === true) {
// //       e.preventDefault()
// //       console.log("E-postadress: " + form) // Skicka sparad e-postadress till MailChimp
// //       setValidateEmail("Tack, din e-postadress är registrerad.")
// //       setForm('')
// //     } else {
// //       setValidateEmail("Vänligen ange en korrekt e-postadress.")
// //     }
// //   }

// //   return (
// //     <Container>
// //       <StyledForm 
// //         id="email" 
// //         type="email" 
// //         name="email"
// //         value={form}
// //         placeholder="E-postadress"
// //         onChange={handleChange} 
// //       />
// //       {validateEmail}
// //       <Button handleClick={handleSubmit} text="Skicka intresseanmälan" />
// //     </Container>
// //   )
// // }

// // export default NewsletterForm