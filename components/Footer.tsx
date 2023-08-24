import styled from 'styled-components'
import { H5, Paragraph, ParagraphBold } from './Typography'
import { devices } from '../utils/devices'
import NewsletterSubscribe from './NewsletterSubscribe'
import PageWrapper from './PageWrapper'
import PartnerSection from './PartnerSection'
import Navigation from './Navigation'

const Foot = styled.footer`
  width: 100%;
  display: flex;

  @media only screen and (${devices.tablet}) {
    justify-content: center;
  }
`

const ContentWrapper = styled.div`
  flex: 1 1 0;
`

const TextSection = styled.div`
  display: flex;
  flex-direction: column;

  gap: 15px;
  margin-bottom: 40px;
  max-width: 750px;
`

const FlexSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px 28px;
  padding-bottom: 60px;

  @media only screen and (${devices.tablet}) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: space-between;
  }
`

const BottomParent = styled.div`
  flex-direction: column;
  display: flex;
  align-items: flex-start;

  @media only screen and (${devices.tablet}) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  margin: 32px;

  @media only screen and (${devices.tablet}) {
    align-self: flex-start;
  }
`

const Copyright = styled.p`
  color: ${({ theme }) => theme.paperWhite};
  font-size: 13px;
  margin-top: 2rem;
`

const GHLink = styled.p`
  color: ${({ theme }) => theme.paperWhite};
  font-size: 13px;
`

const ContactList = styled.ul`
  list-style: none;
  margin-top: 48px;
  margin-left: 144px;

  @media only screen and (${devices.mobile}) {
    margin: 0;
  }
`

const ContactListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`

const ContactIcon = styled.img`
  margin-right: 16px;
`

const ContactLink = styled.a`
  text-decoration: none;
  font-weight: bold;
  font-size: 13px;
`

const Footer = () => {
  return (
    <>
      <PageWrapper backgroundColor={'darkGrey'}>
        <Foot>
          <ContentWrapper>
            <Navigation />
            <TextSection>
              <ParagraphBold>Vill du få nyheter om Klimatkollen?</ParagraphBold>
              <NewsletterSubscribe />
            </TextSection>
            <TextSection>
              <H5>Samarbetspartners</H5>
            </TextSection>
            <FlexSection>
              <PartnerSection
                link='https://postkodstiftelsen.se/'
                logo={<img src="/icons/postkodstiftelsen.svg" width={180} height={'auto'} alt="Postkodstiftelsen logo" />} />
              <PartnerSection
                link='https://www.wwf.se/'
                logo={<img src='/WWF_Logo_Small_RGB_72dpi.jpg' width={'auto'} height={90} alt="WWF logo" />} />
              <PartnerSection
                link='https://www.climateview.global/'
                logo={<img src="/icons/climateview.svg" width={180} height={'auto'} alt="ClimateViw logo" />} />
              <PartnerSection
                link='https://www.klimatklubben.se/'
                logo={<img src="/icons/klimatklubben.svg" width={'auto'} height={90} alt="Klimatklubben logo" />} />
            </FlexSection>
          </ContentWrapper>
        </Foot>
      </PageWrapper>
      <PageWrapper backgroundColor={'darkestGrey'}>
        <BottomParent>
          <BottomContainer>
            <img src='/klimatkollen_logo.svg' height='36px' alt='Klimatkollen logo' />
            <Paragraph>
              Klimatkollen är en medborgarplattform som tillgängliggör klimatdata.
            </Paragraph>
            <Copyright>
              CC BY-SA -{' '}
              <a
                href="http://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noreferrer license">
                Attribution-ShareAlike 4.0 International license
              </a>
            </Copyright>
            <GHLink>
              Klimatkollen är{' '}
              <a
                href="https://github.com/Klimatbyran/klimatkollen"
                target="_blank"
                rel="noreferrer">
                öppen källkod
              </a>
            </GHLink>
          </BottomContainer>
          <BottomContainer>
            <ContactList>
              <ContactListItem>
                <ContactIcon 
                src='icons/icon_mail_circle.svg'
                alt='Email icon' />
                <ContactLink
                  href="mailto:hej@klimatkollen.se">
                  Mail
                </ContactLink>
              </ContactListItem>
              <ContactListItem>
                <ContactIcon 
                src='icons/icon_linkedin_circle.svg' 
                alt='Linkedin logo' />
                <ContactLink
                  href="https://www.linkedin.com/company/klimatkollen/"
                  target="_blank"
                  rel="noreferrer">
                  LinkedIn
                </ContactLink>
              </ContactListItem>
              <ContactListItem>
                <ContactIcon 
                src='icons/icon_twitter_circle.svg'
                alt='Twitter logo' />
                <ContactLink
                  href="https://twitter.com/klimatkollen"
                  target="_blank"
                  rel="noreferrer">
                  Twitter
                </ContactLink>
              </ContactListItem>
            </ContactList>
          </BottomContainer>
        </BottomParent>
      </PageWrapper >
    </>
  )
}

export default Footer
