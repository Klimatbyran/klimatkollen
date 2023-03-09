import styled from 'styled-components'
import { Paragraph, H5, ParagraphBold } from './Typography'
import { devices } from '../utils/devices'
import ClimateView from '../public/icons/climateview.svg'
import VBK from '../public/icons/vbk.svg'
import Argand from '../public/icons/argand.svg'
import StormGeo from '../public/icons/stormgeo.svg'
import NewsletterSubscribe from './NewsletterSubscribe'
import PageWrapper from './PageWrapper'
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

  @media only screen and (${devices.tablet}) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: space-between;
  }
`

const IconSection = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  gap: 15px;

  @media only screen and (${devices.tablet}) {
    flex: 0 1 350px;
  }
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`

const LogoParagraph = styled(Paragraph)`
  max-width: 350px;
  text-align: center;
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
          <TextSection>
            <ParagraphBold>Vill du få nyheter om Klimatkollen?</ParagraphBold>
            <NewsletterSubscribe />
          </TextSection>
          <TextSection>
            <H5>Våra samarbetspartners</H5>
          </TextSection>
          <FlexSection>
            <IconSection>
              <IconWrapper>
                <a href="https://www.wwf.se/" target="_blank" rel="noreferrer">
                  <Image src={'/WWF_Logo_Small_RGB_72dpi.jpg'} width={86} height={97} />
                </a>
              </IconWrapper>
              <LogoParagraph>
                Global miljöorganisation med 200 000 svenska supportrar.
              </LogoParagraph>
            </IconSection>
            <IconSection>
              <IconWrapper>
                <a
                  href="https://www.climateview.global/"
                  target="_blank"
                  rel="noreferrer">
                  <ClimateView />
                </a>
              </IconWrapper>
              <LogoParagraph>
                Hjälper kommuner och städer att planera och analysera klimatarbetet.
              </LogoParagraph>
            </IconSection>
            <IconSection>
              <IconWrapper>
                <a href="https://varabarnsklimat.se/" target="_blank" rel="noreferrer">
                  <VBK />
                </a>
              </IconWrapper>
              <LogoParagraph>
                En ideell påverkansorganisation som tar fajten för barns rättigheter i
                klimatomställningen.
              </LogoParagraph>
            </IconSection>
            <IconSection>
              <IconWrapper>
                <a href="https://www.klimatklubben.se/" target="_blank" rel="noreferrer">
                  <img src="/icons/klimatklubben.svg" alt="Klimatklubben logo" />
                </a>
              </IconWrapper>
              <LogoParagraph>
                Samlar människor för att skapa opinion och klimatengagemang.
              </LogoParagraph>
            </IconSection>
            <IconSection>
              <IconWrapper>
                <a
                  href="https://www.wedonthavetime.org/"
                  target="_blank"
                  rel="noreferrer">
                  <img src="/icons/we-dont-have-time.svg" alt="Wedonthavetime logo" />
                </a>
              </IconWrapper>
              <LogoParagraph>
                Världens största sociala nätverk för klimataktion. Skapa din egen kampanj{' '}
                <a
                  href="https://www.wedonthavetime.org/"
                  target="_blank"
                  rel="noreferrer">
                  här
                </a>
                .
              </LogoParagraph>
            </IconSection>
            <IconSection>
              <IconWrapper>
                <a href="https://argandpartners.com/" target="_blank" rel="noreferrer">
                  <Argand />
                </a>
              </IconWrapper>
              <LogoParagraph>Investerar i klimatlösningar.</LogoParagraph>
            </IconSection>
            <IconSection>
              <IconWrapper>
                <a href="https://www.stormgeo.com/" target="_blank" rel="noreferrer">
                  <StormGeo />
                </a>
              </IconWrapper>
              <LogoParagraph>
                Skandinaviens första privata väderföretag, en global leverantör av
                vädertjänster.
              </LogoParagraph>
            </IconSection>
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
