import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const dash = keyframes`
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Spinner = styled.svg`
  animation: ${rotate} 2s linear infinite;
  width: 100px;
  height: 100px;
`;

const Circle = styled.circle`
  stroke: #3498db;
  stroke-width: 4;
  stroke-linecap: round;
  animation: ${dash} 1.5s ease-in-out infinite;
`;

const Loader = () => (
  <Container>
    <Spinner viewBox="0 0 50 50">
      <Circle cx="25" cy="25" r="20" fill="none" />
    </Spinner>
  </Container>
);

export default Loader;