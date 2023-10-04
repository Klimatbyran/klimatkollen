import styled from 'styled-components'
import { devices } from '../../utils/devices'

const ContactList = styled.ul`
  list-style: none;

  @media only screen and (${devices.tablet}) {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: repeat(2, 1fr);
    justify-items: right;
  }
`

const ContactListItem = styled.li`
  width: 128px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
`

const ContactIcon = styled.img`
  margin-right: 16px;
`

const ContactLink = styled.a`
  text-decoration: none;
  font-weight: bold;
  font-size: 13px;
`

type SocialListItemProps = {
  icon: string
  alt: string
  link: string
  text: string
}

function SocialListItem({
  icon, alt, link, text,
}: SocialListItemProps): JSX.Element {
  return (
    <ContactListItem>
      <ContactIcon src={icon} alt={alt} />
      <ContactLink href={link} target="_blank" rel="noreferrer">
        {text}
      </ContactLink>
    </ContactListItem>
  )
}

function SocialList() {
  return (
    <ContactList>
      <SocialListItem
        icon="icons/icon_mail_circle.svg"
        alt="Email icon"
        link="mailto:hej@klimatkollen.se"
        text="Maila oss"
      />
      <SocialListItem
        icon="icons/x_circle.svg"
        alt="X (Twitter) logo"
        link="https://twitter.com/klimatkollen"
        text="X (Twitter)"
      />
      <SocialListItem
        icon="icons/icon_linkedin_circle.svg"
        alt="Linkedin logo"
        link="https://www.linkedin.com/company/klimatkollen/"
        text="LinkedIn"
      />
      <ContactListItem>
        <ContactIcon src="icons/github.svg" alt="GitHub logo" />
        <ContactLink
          href="https://github.com/Klimatbyran/klimatkollen"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </ContactLink>
      </ContactListItem>
    </ContactList>
  )
}

export default SocialList
