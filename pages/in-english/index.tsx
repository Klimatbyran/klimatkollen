import { GetServerSideProps } from 'next'
import { ReactElement } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import MetaTags from '../../components/MetaTags'
import {
  H2, H4, Paragraph, ParagraphItalic,
} from '../../components/Typography'
import PageWrapper from '../../components/PageWrapper'
import Layout from '../../components/Layout'
import Footer from '../../components/Footer/Footer'
import { Grid, GridImage, GridItem } from '../../components/shared'

const Ola = '/team/ola.jpg'
const Frida = '/team/frida.jpg'
const Elvira = '/team/elvira.jpg'

const Container = styled.section`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`

const PaddedParagraph = styled(Paragraph)`
  padding-bottom: 24px;
`

const SocialMediaContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
`

const RoundedImage = styled(Image)`
  border-radius: 16px;
  margin: 8px 0;
`

function InEnglish() {
  return (
    <>
      <MetaTags title="In English" description="Klimatkollen in English" />
      <PageWrapper backgroundColor="black">
        <Container>
          <H2>About us</H2>
          <Paragraph>
            Klimatkollen (Climate Checker) is a Swedish open source platform visualising
            climate data for citizens.
          </Paragraph>
          <Paragraph>
            We believe that data transparency and citizen engagement are key to generating
            the public pressure needed to make sure local governments and companies cut
            emissions in line with the Paris Agreement.
          </Paragraph>
          <PaddedParagraph>
            As proud winners of the
            {' '}
            <a
              href="https://blog.google/outreach-initiatives/sustainability/boosting-sustainable-solutions-from-sweden/"
              target="_blank"
              rel="noreferrer"
            >
              2023 Google.org Impact Challenge: Tech for Social Good
            </a>
            , we will be scaling up and supercharging our citizen platform with AI,
            allowing us to add corporate emissions data and new features to analyze and
            compare climate action across local governments and companies. Read more about
            the project
            {' '}
            <a
              // eslint-disable-next-line max-len
              href="https://www.mynewsdesk.com/se/klimatbyraan/pressreleases/klimatkollen-faar-maangmiljonstoed-fraan-google-punkt-org-foer-att-oeka-oeppenheten-om-foeretagens-utslaepp-3284663"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
            {' '}
            (in Swedish).
          </PaddedParagraph>

          <H2>Our team</H2>
          <Grid>
            <GridItem>
              <GridImage
                src={Frida}
                alt="Frida Berry Eklund"
                width="200px"
                height="200px"
              />
              <b>Frida Berry Eklund, Co-founder</b>
              Senior climate communications specialist and founder of several climate
              initiatives, including the international platform, Our Kids’ Climate. She’s
              also an author and public speaker, as well as a EU Climate Pact Ambassador
              and Climate Reality Leader.
              {' '}
              <SocialMediaContainer>
                <a
                  href=" https://www.linkedin.com/in/fridaberryeklund/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src="/icons/some/linkedin_white.svg"
                    alt="LinkedIn logo"
                    width="24px"
                    height="24px"
                  />
                </a>
                <a
                  href="https://twitter.com/klimatfrida"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src="/icons/some/x_white.svg"
                    alt="X logo"
                    width="24px"
                    height="24px"
                  />
                </a>
              </SocialMediaContainer>
            </GridItem>
            <GridItem>
              <GridImage
                src={Ola}
                alt="Ola Spännar"
                width="200px"
                height="200px"
              />
              <b>Ola Spännar, Co-founder</b>
              Senior climate communications specialist and founder of several climate
              initiatives, including the international platform, Our Kids’ Climate. She’s
              also an author and public speaker, as well as a EU Climate Pact Ambassador
              and Climate Reality Leader.
              <SocialMediaContainer>
                <a
                  href=" https://www.linkedin.com/in/ospannar/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src="/icons/some/linkedin_white.svg"
                    alt="LinkedIn logo"
                    width="24px"
                    height="24px"
                  />
                </a>
                <a href="https://twitter.com/olaspannar" target="_blank" rel="noreferrer">
                  <Image
                    src="/icons/some/x_white.svg"
                    alt="X logo"
                    width="24px"
                    height="24px"
                  />
                </a>
              </SocialMediaContainer>
            </GridItem>
            <GridItem>
              <GridImage
                src={Elvira}
                alt="Elvira Boman"
                width="200px"
                height="200px"
              />
              <b>Elvira Boman, Tech Lead</b>
              Tech Lead Full Stack Developer and Engineering Physicist at Klimatkollen and
              Precisit. Extensive experience in green and circular tech at multiple award
              winning startups and part of the leadership team at IT consulting agency
              Precisit.
              <SocialMediaContainer>
                <a
                  href=" https://www.linkedin.com/in/elviraboman/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src="/icons/some/linkedin_white.svg"
                    alt="LinkedIn logo"
                    width="24px"
                    height="24px"
                  />
                </a>
              </SocialMediaContainer>
            </GridItem>
          </Grid>
          <H4>Want to use your skills for climate impact?</H4>
          <PaddedParagraph>
            We are currently looking for people that share our vision and want to help us
            grow. We’re especially interested in AI aficionados, data visualizers, UX
            specialists and climate data scientists. Please write us a message at
            {' '}
            <a href="mailto:hej@klimatkollen.se">hej@klimatkollen.se</a>
            .
          </PaddedParagraph>
          <H4>Interested in taking Klimatkollen to your country?</H4>
          <PaddedParagraph>
            Do drop us a line if you want to hear more about what we do and want to
            collaborate. We’re especially looking for co-funders and partner organisations
            in high-emitting countries, with an interest in climate data transparency and
            using tech and AI for good.
          </PaddedParagraph>
          <H2>Klimatkollen today</H2>
          <RoundedImage
            src="/board/whole_board.jpg"
            alt="Klimatkollen board"
            layout="responsive"
            width="9192px"
            height="6128px"
          />
          <ParagraphItalic>
            Jona Granath / Klimatkollen&apos;s board from left to right in picture:
            Christian Landgren, Maria Soxbo, Ola Spännar, Frida Berry Eklund, Carl-Johan
            Schultz and Anna Loverus.
          </ParagraphItalic>
          <Paragraph>
            Klimatkollen gives citizens knowledge about how Sweden’s 290 municipalities
            are tracking compared to the Paris Agreement. We do this by presenting
            essential climate data in a simple and shareable format.
          </Paragraph>
          <Paragraph>
            Our data comes from a mix of sources, such as governmental databases, research
            institutions and other public sources, like Wikidata. We also enlist the help
            of citizens to crowdsource data.
          </Paragraph>
          <Paragraph>
            We use communication and visualisations to make data understandable, media
            outreach to contribute to a fact-based climate debate, and collaboration with
            partner organisations to inform and engage citizens.
          </Paragraph>
          <Paragraph>
            We work through – and with – partners across civil society, the corporate
            sector, media and research institutions. See some of our partners below.
          </Paragraph>
          <Paragraph>
            Klimatkollen was founded in 2021, by Frida Berry Eklund and Ola Spännar with
            the support of WWF, ClimateView, Klimatklubben and Våra barns klimat.
          </Paragraph>
          <Paragraph>
            Klimatkollen is a platform for – and by – citizens, and we welcome
            contributions through
            {' '}
            <a
              href="https://github.com/Klimatbyran/klimatkollen"
              target="_blank"
              rel="noreferrer"
            >
              Github
            </a>
            {' '}
            and
            {' '}
            <a href="https://discord.gg/5xeqknPa" target="_blank" rel="noreferrer">
              Discord
            </a>
            .
          </Paragraph>
          <PaddedParagraph>
            If you want to support our work, please don’t hesitate to contact us via
            {' '}
            <a href="mailto:hej@klimatkollen.se">hej@klimatkollen.se</a>
            .
          </PaddedParagraph>
          <H2>Klimatkollen wins the Google.org Impact Challenge: Tech for Social Good</H2>
          <Paragraph>
            In November 2023, Klimatkollen was one of two Swedish winners of the
            Google.org Impact Challenge: Tech for Social Good.
          </Paragraph>
          <Paragraph>
            During 2024–2026 we will build and integrate AI solutions into our platform,
            allowing for more and better climate data availability for citizens,
            increasing transparency of municipalities, governments and companies to cut
            emissions in line with the Paris Agreement.
          </Paragraph>
          <Paragraph>
            A key focus of the project is to increase the public availability and
            transparency of corporate climate data, making it easier for citizens to know
            if a company is in line with the Paris Agreement, or not.
          </Paragraph>
          <Paragraph>
            Companies are part of the problem as well as the solutions to climate change.
            In 2019–2020, large and medium sized Swedish companies emitted a whopping 250
            million tonnes of CO2, five times the amount of our territorial emissions.
          </Paragraph>
          <Paragraph>
            There is a big gap between what companies say and what they actually do, to
            bring emissions down. And it’s hard for ordinary citizens to know what’s
            greenwashing and real action.
          </Paragraph>
          <Paragraph>
            Our AI solutions will increase both quantity and quality of climate data
            freely available to citizens, driving interaction and action both on and
            beyond our platform.
          </Paragraph>
          <Paragraph>
            <b>Want to know more?</b>
            {' '}
            Please drop us a line at
            {' '}
            <a href="mailto:hej@klimatkollen.se">hej@klimatkollen.se</a>
            .
          </Paragraph>
        </Container>
      </PageWrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader(
    'Cache-Control',
    `public, stale-while-revalidate=60, max-age=${60 * 60 * 24 * 7}`,
  )

  return {
    props: {},
  }
}

export default InEnglish

InEnglish.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
      <Footer />
    </>
  )
}
