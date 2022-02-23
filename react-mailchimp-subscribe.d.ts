type Status = 'sending' | 'error' | 'success'
type FormData = {
  [key: string]: string
}

interface IProps {
  url: string;
  render: (props: { subscribe: (formData: FormData) => void, status: Status, message: string }) => React.ReactNode
}

declare module 'react-mailchimp-subscribe' {
  export default class MailchimpSubscribe extends React.Component<IProps> {}
}