import styled from 'styled-components'
import { useTranslation } from 'next-i18next'
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
  height: 24px;
  width: 24px;
`
const DiscordIcon = styled.img`
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

export function SocialListItem({
  icon, alt, link, text,
}: SocialListItemProps): JSX.Element {
  return (
    <ContactListItem>
      {text === 'Discord' ? <DiscordIcon src={icon} alt={alt} /> : <ContactIcon src={icon} alt={alt} /> }
      <ContactLink href={link} target="_blank" rel="noreferrer">
        {text}
      </ContactLink>
    </ContactListItem>
  )
}

function SocialList() {
  const { t } = useTranslation()
  return (
    <ContactList>
      <SocialListItem
        icon="/icons/icon_mail_circle.svg"
        alt="Email icon"
        link="mailto:hej@klimatkollen.se"
        text={t('footer.email-us')}
      />
      <SocialListItem
        icon="/icons/some/x_circle.svg"
        alt="X (Twitter) logo"
        link="https://twitter.com/klimatkollen"
        text="X (Twitter)"
      />
      <SocialListItem
        icon="/icons/some/linkedin_black.svg"
        alt="Linkedin logo"
        link="https://www.linkedin.com/company/klimatkollen/"
        text="LinkedIn"
      />
      <ContactListItem>
        <ContactIcon src="/icons/some/github.svg" alt="GitHub logo" />
        <ContactLink
          href="https://github.com/Klimatbyran/klimatkollen"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </ContactLink>
      </ContactListItem>
      <SocialListItem
        icon="/icons/some/discord.svg"
        alt="Discord logo"
        link="https://discord.gg/FPX9yqYAmk"
        text="Discord"
      />

      <SocialListItem
        icon="/icons/some/Facebook_Logo_Secondary.png"
        alt="Facebook icon"
        link="https://www.facebook.com/klimatkollen"
        text="Facebook"
      />

      <SocialListItem
        icon="/icons/some/Instagram_Glyph_Black.svg"
        alt="Instagram icon"
        link="https://instagram.com/klimatkollen.se"
        text="Instagram"
      />
    </ContactList>
  )
}

export default SocialList
