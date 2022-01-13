import styled from 'styled-components'
import { Paragraph, ParagraphBold } from './Typography'
import Image from 'next/image'
import infoIcon from '../public/icons/info.svg'

const StyledDiv = styled.div`
  width: 334px;
  height: 282px;
  background: #424242;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & div.row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  & section.left {
    display: flex;
  }

  & section.right {
    text-align: right;
  }
`;

const StyledIcon = styled.div`
  margin-left: 20px;

  &:hover {
    cursor: pointer;
  }
`;

const InfoBox = () => {
  return (
    <>
      <StyledDiv>
        <div className="row">
          <section className="left">
            <Paragraph>Här sitter</Paragraph>
            <StyledIcon>
              <Image src={infoIcon} />
            </StyledIcon>
          </section>
          <section className="right">
            <ParagraphBold>Moderaterna</ParagraphBold>
          </section>
        </div>

        <div className="row">
          <section className="left">
            <Paragraph>Koldioxidbudget</Paragraph>
            <StyledIcon>
              <Image src={infoIcon} />
            </StyledIcon>
          </section>
          <section className="right">
            <ParagraphBold>500 kVM</ParagraphBold>
          </section>
        </div>

        <div className="row">
          <section className="left">
            <Paragraph>Utsläpp historiskt</Paragraph>
            <StyledIcon>
              <Image src={infoIcon} />
            </StyledIcon>
          </section>
          <section className="right">
            <ParagraphBold>500 kVM</ParagraphBold>
          </section>
        </div>

        <div className="row">
          <section className="left">
            <Paragraph>Glappet</Paragraph>
            <StyledIcon>
              <Image src={infoIcon} />
            </StyledIcon>
          </section>
          <section className="right">
            <ParagraphBold>500 kVM</ParagraphBold>
          </section>
        </div>

        <div className="row">
          <section className="left">
            <Paragraph>Tre största utsläpp</Paragraph>
            <StyledIcon>
              <Image src={infoIcon} />
            </StyledIcon>
          </section>
          <section className="right">
            <ParagraphBold>500 kVM</ParagraphBold>
          </section>
        </div>

        <div className="row">
          <section className="left">
            <Paragraph>Finns det en plan?</Paragraph>
            <StyledIcon>
              <Image src={infoIcon} />
            </StyledIcon>
          </section>
          <section className="right">
            <ParagraphBold>Ja</ParagraphBold>
          </section>
        </div>
      </StyledDiv>
    </>
  )
}

export default InfoBox
