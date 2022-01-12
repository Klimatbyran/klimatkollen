import styled from 'styled-components';

const Button = styled.div`
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

  p {
    font-weight: bold;
    margin-left: 30%;
  }
`;

const ShareButton = () => {
  return (
    <>
      <Button>
        <img src="/icons/share.svg" alt="Share icon" />
        <p>Dela</p>
      </Button>
    </>
  )
}

export default ShareButton;