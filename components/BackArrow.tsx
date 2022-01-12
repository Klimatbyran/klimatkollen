import styled from 'styled-components';
import ArrowLeft from '../public/icons/arrow-left.svg';

const StyledIcon = styled(ArrowLeft)`
    fill: #fff;

    @media only screen and (min-width: 768px) {
        display: none;
    }
`;

const BackArrow = () => {
    return <StyledIcon />
}

export default BackArrow;