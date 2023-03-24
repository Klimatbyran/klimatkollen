import styled from 'styled-components'
import { H5, ParagraphBold } from './Typography'
import { devices } from '../utils/devices'
import NewsletterSubscribe from './NewsletterSubscribe'
import PageWrapper from './PageWrapper'
import PartnerSection from './PartnerSection'
import Navigation from './Navigation'
import Image from 'next/image'

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

const Copyright = styled.p`
  color: ${({ theme }) => theme.lightGrey};
  font-size: 13px;
  text-align: center;
  margin-top: 4rem;
`

const GHLink = styled.p`
  color: ${({ theme }) => theme.lightGrey};
  font-size: 13px;
  text-align: center;
`

const Footer = () => {
  return (
    <PageWrapper backgroundColor="dark">
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
          <TextSection>
            <H5>Tidigare samarbetspartners</H5>
          </TextSection>
          <FlexSection>
            <PartnerSection
              link='https://www.pwc.se/'
              logo={<img src='/pwc.png' width={'auto'} height={90} alt="PWC logo" />} />
            <PartnerSection
              link='https://varabarnsklimat.se/'
              logo={<img src="/icons/vbk.svg" width={86} height={'auto'} alt="Våra barns klimat logo" />} />
            <PartnerSection
              link='https://www.wedonthavetime.org/'
              logo={<img src="/icons/we-dont-have-time.svg" width={180} height={'auto'} alt="Wedonthavetime logo" />} />
            <PartnerSection
              link='https://argandpartners.com/'
              logo={<img src="/icons/argand.svg" width={180} height={'auto'} alt="Argand logo" />} />
            <PartnerSection
              link='https://www.stormgeo.com/'
              logo={<img src="/icons/stormgeo.svg" width={180} height={'auto'} alt="StromGeo logo" />} />
          </FlexSection>
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
        </ContentWrapper>
      </Foot>
    </PageWrapper >
  )
}

export default Footer
