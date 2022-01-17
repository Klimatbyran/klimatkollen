import styled from 'styled-components'

const Button = styled.button`
  width: 216px;
  height: 56px;
  color: ${({ theme }) => theme.black};
  background: ${({ theme }) => theme.main};
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 0;
  padding: 0 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  fill: ${({ theme }) => theme.black};

  p {
    font-weight: bold;
    font-size: 16px;
    margin-left: 30%;
  }

  &:hover {
    background: ${({ theme }) => theme.greenGraphTwo};
  }

  &:focus {
    border: 2px solid ${({ theme }) => theme.white};
  }

  &:disabled {
    background: ${({ theme }) => theme.grey};
    color: ${({ theme }) => theme.white};
    fill: ${({ theme }) => theme.white};
  }
`

type ShareButtonProps = {
  handleClick: () => void
}

const ShareButton = ({ handleClick }: ShareButtonProps) => {
  return (
    <Button onClick={handleClick}>
      <p>Dela</p>
    </Button>
  )
}

export default ShareButton
