import MailchimpSubscribe from 'react-mailchimp-subscribe'
import NewsletterForm from './FooterNewsletterForm'

function NewsletterSubscribe() {
  const MAILCHIMP_URL = process.env.NEXT_PUBLIC_MAILCHIMP_URL || "https://"

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
