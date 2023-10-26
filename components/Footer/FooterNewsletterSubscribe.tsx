import MailchimpSubscribe from 'react-mailchimp-subscribe'
import NewsletterForm from './FooterNewsletterForm'

function NewsletterSubscribe() {
  const MAILCHIMP_URL = process.env.NEXT_PUBLIC_MAILCHIMP_URL
  if (MAILCHIMP_URL === undefined) throw new Error('Must have a mailchimp URL')

  return (
    <MailchimpSubscribe
      url={MAILCHIMP_URL}
      render={({ subscribe, status }) => (
        <NewsletterForm 
          status={status}
          onValidated={(formData) => subscribe(formData)}
        />
      )}
    />
  )
}

export default NewsletterSubscribe
