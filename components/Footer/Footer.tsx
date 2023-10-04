import styled from 'styled-components'
import { H5, Paragraph } from '../Typography'
import { devices } from '../../utils/devices'
import NewsletterSubscribe from './FooterNewsletterSubscribe'
import PageWrapper from '../PageWrapper'
import Partners from './FooterPartners'
import SocialList from './FooterSocialLinks'

const Foot = styled.div`
  width: 100%;

  @media only screen and (${devices.tablet}) {
    justify-content: center;
  }
`

const StyledH5 = styled(H5)`
  color: ${({ theme }) => theme.midGreen};
  margin: 16px;

  @media only screen and (${devices.tablet}) {
    margin: 32px;
  }
`

const BottomParent = styled.div`
  color: ${({ theme }) => theme.black};
`

const TextContainer = styled.div`
  @media only screen and (${devices.tablet}) {
    width: 45%;
  }
`

const Copyright = styled.p`
  font-family: 'Anonymous Pro';
  font-size: 13px;
  margin-top: 1rem;
`

const GHLink = styled.p`
  font-family: 'Anonymous Pro';
  font-size: 13px;
`

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  gap: 32px;

  @media only screen and (${devices.tablet}) {
    flex-direction: row;
    margin-top: 16px;
  }
`

const LogoContainer = styled.div`
  flex: 1;
  order: 2;

  @media only screen and (${devices.tablet}) {
    align-self: end;
    order: 1;
  }
`

const SocialLinksContainer = styled.div`
  flex: 1;
  order: 1;

  @media only screen and (${devices.tablet}) {
    order: 2;
  }
`

function Footer() {
  return (
    <>
      <PageWrapper backgroundColor="black">
        <Foot>
          <NewsletterSubscribe />
          <StyledH5>Samarbetspartners</StyledH5>
          <Partners />
        </Foot>
      </PageWrapper>
      <PageWrapper backgroundColor="midGreen">
        <BottomParent>
          <TextContainer>
            <Paragraph>
              Klimatkollen är en medborgarplattform som tillgängliggör klimatdata
            </Paragraph>
            <Copyright>
              CC BY-SA -
              {' '}
              <a
                href="http://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noreferrer license"
              >
                Attribution-ShareAlike 4.0 International license
              </a>
            </Copyright>
            <GHLink>
              Klimatkollen är utvecklad med
              {' '}
              <a
                href="https://github.com/Klimatbyran/klimatkollen"
                target="_blank"
                rel="noreferrer"
              >
                öppen källkod
              </a>
            </GHLink>
          </TextContainer>
          <HorizontalContainer>
            <SocialLinksContainer>
              <SocialList />
            </SocialLinksContainer>
            <LogoContainer>
              <img
                src="/logos/klimatkollen_logo_black.svg"
                height="64px"
                alt="Klimatkollen logo"
              />
            </LogoContainer>
          </HorizontalContainer>
        </BottomParent>
      </PageWrapper>
    </>
  )
}

export default Footer
