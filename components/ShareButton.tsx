import styled from 'styled-components';
import ShareIcon from '../public/icons/share.svg';

const Button = styled.button`
  width: 216px;
  height: 56px;
  color: ${(props) => props.theme.black};
  background: ${(props) => props.theme.main};
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 0;
  padding: 0 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  fill: ${(props) => props.theme.black};

  p {
    font-weight: bold;
    font-size: 16px;
    margin-left: 30%;
  }

  &:hover {
    background: ${(props) => props.theme.greenGraphTwo};
  }

  &:focus {
    border: 2px solid ${(props) => props.theme.white};
  }

  &:disabled {
    background: ${(props) => props.theme.grey};
    color: ${(props) => props.theme.white};
    fill: ${(props) => props.theme.white};
  }
`;

interface Props {
  handleClick: () => void
}

const ShareButton: React.FC<Props> = ( props ) => {
  return (
      <Button onClick={props.handleClick}>
        <ShareIcon alt="Share icon" />
        <p>Dela</p>
      </Button>
  )
}

export default ShareButton;