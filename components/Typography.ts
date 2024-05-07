import styled from 'styled-components'

export const H1 = styled.h1`
  font-weight: bold;
  font-size: 48px;
  line-height: 1.25;
  margin: 0 0 16px 0;

  @media (max-width: 768px) {
    font-size: 42px;
  }
`

export const H1NoPad = styled.h1`
  font-weight: bold;
  font-size: 48px;
  line-height: 1.25;

  @media (max-width: 768px) {
    font-size: 35px;
  }
`

export const H2 = styled.h2`
  font-weight: bold;
  font-size: 32px;
  line-height: 1.25;
  margin: 0 0 8px 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`

export const H2Regular = styled.h2`
  font-weight: regular;
  font-size: 32px;
  line-height: 1.25;
  text-align: center;
  margin: 0 0 8px 0;
`

export const H3 = styled.h3`
  font-weight: bold;
  font-size: 24px;
  line-height: 1.25;
  margin: 0;
`

export const H4 = styled.h4`
  font-weight: bold;
  font-size: 20px;
  line-height: 1.25;
  margin: 0;
`

export const H4Regular = styled.h4`
  font-weight: regular;
  font-size: 20px;
  line-height: 1.25;
  margin: 0;
  color: ${({ theme }) => theme.midGreen};
`

export const H5 = styled.h5`
  font-weight: bold;
  font-size: 18px;
  line-height: 1.25;
  margin: 0;
`

export const H5Regular = styled.h5`
  font-weight: regular;
  font-size: 18px;
  line-height: 1.25;
  margin: 0;
`

export const Paragraph = styled.p`
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 1.5;
  margin: 11.2px 0;
`

export const ParagraphItalic = styled.p`
  font-style: italic;
  font-weight: 300;
  font-size: 12px;
  margin-bottom: 11.2px;
`

export const ParagraphBold = styled.p`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin: 0;
  margin-bottom: 0.25rem;
`
