import styled from 'styled-components'
import { useTranslation } from 'next-i18next'
import Markdown from 'react-markdown'
import { H5, Paragraph } from '../Typography'
import { devices } from '../../utils/devices'
import NewsletterSubscribe from './FooterNewsletterSubscribe'
import PageWrapper from '../PageWrapper'
import Partners from './FooterPartners'
import SocialList from './FooterSocialLinks'
import Supporters from './FooterSupporters'

const Foot = styled.div`
  width: 100%;

  @media only screen and (${devices.tablet}) {
    justify-content: center;
  }
`

const StyledH5 = styled(H5)`
  color: ${({ theme }) => theme.newColors.blue3};
  margin: 16px;
  text-align: center;

  @media only screen and (${devices.tablet}) {
    margin: 32px;
  }
`

const TextContainer = styled.div`
  padding: 1rem 1rem 0;

  @media only screen and (${devices.tablet}) {
    padding: 0;
  }

  a {
    font-weight: 500;
  }
`

const Copyright = styled.p`
  font-size: 14px;
  margin-top: 1rem;
`

const GHLink = styled.p`
  font-size: 14px;
`

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  gap: 16px;

  @media only screen and (${devices.tablet}) {
    flex-direction: row;
  }
`

const LogoContainer = styled.div`
  order: 2;
  padding-bottom: 2rem;

  @media only screen and (${devices.tablet}) {
    padding: 0;
    align-self: center;
    order: 1;
  }

  & img {
    max-height: 56px;
  }
`

const SocialLinksContainer = styled.div`
  flex: 1;
  order: 1;
  
  padding: 0 1rem;
  

  @media only screen and (${devices.tablet}) {
    padding: 0;
    order: 2;
  }
`

type Props = {
  minimal?: boolean
}

function Footer({ minimal }: Props) {
  const { t } = useTranslation(['common'])

  return (
    <>
      {!minimal ? (
        <PageWrapper>
          <Foot>
            <NewsletterSubscribe />
            <StyledH5>{t('footer.supportedBy')}</StyledH5>
            <Supporters />
            <StyledH5>{t('footer.partners')}</StyledH5>
            <Partners />
          </Foot>
        </PageWrapper>
      ) : null}
      <PageWrapper backgroundColor="black2">
        <TextContainer>
          <Paragraph>{t('footer.tagline')}</Paragraph>
          <Markdown components={{ p: Copyright }}>{t('footer.license')}</Markdown>
          <Markdown components={{ p: GHLink }}>{t('footer.developedWith')}</Markdown>
        </TextContainer>
        <HorizontalContainer>
          <SocialLinksContainer>
            <SocialList />
          </SocialLinksContainer>
          <LogoContainer>
            <img
              src="/logos/klimatkollen_logo.svg"
              width="100%"
              loading="lazy"
              alt="Klimatkollen logo"
            />
          </LogoContainer>
        </HorizontalContainer>
      </PageWrapper>
    </>
  )
}

export default Footer
