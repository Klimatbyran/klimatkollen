import styled from 'styled-components';
import ShareIcon from '../public/icons/share.svg';

const Button = styled.button`
  width: 216px;
  height: 56px;
  color: #2d2d2d;
  background: ${(props) => props.theme.main};
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 0;
  padding: 0 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  fill: #2d2d2d;
  margin: 50px;

  p {
    font-weight: bold;
    font-size: 16px;
    margin-left: 30%;
  }

  &:hover {
    background: #94d3c1;
  }

  &:focus {
    border: 2px solid #fff;
  }

  &:disabled {
    background: #6c6c6c;
    color: #fff;
    fill: #fff;
  }
`;

const ShareButton = () => {
  return (
    <>
      <Button>
        <ShareIcon alt="Share icon" />
        <p>Dela</p>
      </Button>
    </>
  )
}

export default ShareButton;