import styled from 'styled-components'
import { Paragraph, ParagraphBold } from './Typography'
import Icon from '../public/icons/info.svg'

const StyledDiv = styled.div`
  min-width: 290px;
  max-width: 330px;
  height: 282px;
  background: ${({ theme }) => theme.dark};
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 15px;
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
  margin-left: 12px;

  &:hover {
    cursor: pointer;
  }
`;

const InfoBox = () => {
  return (
    <StyledDiv>
      <div className="row">
        <section className="left">
          <Paragraph>Här sitter</Paragraph>
          <StyledIcon>
            <Icon />
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
            <Icon />
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
            <Icon />
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
            <Icon />
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
            <Icon />
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
            <Icon />
          </StyledIcon>
        </section>
        <section className="right">
          <ParagraphBold>Ja</ParagraphBold>
        </section>
      </div>
    </StyledDiv>
  )
}

export default InfoBox
