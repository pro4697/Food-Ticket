import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Row, Col, message } from 'antd';
import { FadeIn, LoadingIcon } from '../../Style_Etc';

const App = styled.div`
  flex-direction: column;
  padding-top: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  /* min-height: 600px; */
  margin: auto;
  @media (max-width: 767px) {
    padding: 0rem;
    height: 100%;
    background-color: #1890ff;
  }
`;

const Title = styled.div`
  font-size: 30px;
  margin-bottom: 100px;
  @media (max-width: 767px) {
    margin-top: 50px;
    margin-bottom: 70px;
    color: white;
  }
`;

const CardContainer = styled(Row)`
  width: 100%;
  @media (max-width: 767px) {
    padding: 5px !important;
    margin: 0 !important;
    margin-bottom: -1px !important;
    border-radius: 30px 30px 0 0 !important;
    background-color: white;
    box-shadow: 3px -7px 5px rgba(50, 50, 93, 0.2),
      -3px -7px 5px rgba(50, 50, 93, 0.2);
  }
`;

const StyledLink = styled(Link)`
  position: fixed;
  top: 0;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 5px;
  transition: 0.2s;
  height: 100%;
  width: 100%;
  overflow: visible !important;
  @media (max-width: 767px) {
    position: relative;
    flex-direction: column;
    width: inherit;
    height: inherit;
    display: flex;
    padding: 16px;
  }
`;

const Img = styled.img`
  position: relative;
  height: 100%;
  width: 25%;
  align-self: center;
  margin-bottom: 5px;
  transition: 0.2s;
  background: cover;
  background-position: center center;
  @media (max-width: 767px) {
    position: relative;
    width: 210px;
    height: 210px;
    border-radius: 10px;
    box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25),
      0 8px 16px -8px rgba(0, 0, 0, 0.3), 0 -6px 16px -6px rgba(0, 0, 0, 0.025);
  }
`;

const Blur = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.6;
  background-color: white;
  transition: 0.5s;
  @media (max-width: 767px) {
    display: none;
  }
`;

const CardTitle = styled.span`
  position: relative;
  width: 100%;
  text-align: center;
  z-index: 1;
  color: black;
  font-size: 22px;
  letter-spacing: 2px;
  transition: 0.2s;
  font-weight: 700;
  margin-top: 5px;
  user-select: none;
  @media (max-width: 1200px) {
    font-size: 18px;
  }
  @media (max-width: 992px) {
    font-size: 16px;
  }
  @media (max-width: 767px) {
    font-size: 14px;
    background-color: transparent;
    width: inherit;
  }
`;

const Card = styled(Col)`
  position: relative !important;
  transition: 0.2s !important;
  -webkit-animation: ${FadeIn} 0.3s ease;
  -moz-animation: ${FadeIn} 0.3s ease;
  -ms-animation: ${FadeIn} 0.3s ease;
  -o-animation: ${FadeIn} 0.3s ease;
  animation: ${FadeIn} 0.3s ease;
  &:hover ${StyledLink} {
    @media (max-width: 767px) {
      transition: 0.2s;
      border: 10px solid transparent;
    }
    /* opacity: 0; */
    /* transform: scale(1.08) !important; */
  }
  &:hover ${CardTitle} {
    @media (max-width: 1200px) {
      font-size: 18px;
    }
    @media (max-width: 992px) {
      font-size: 16px;
    }
    @media (max-width: 767px) {
      font-size: 14px;
    }
  }
  &:hover ${Blur} {
    opacity: 0;
  }
`;

export const sectionName = [
  '1F 구내식당',
  'B1 구내식당',
  '1F Starbucks',
  '식권 보관함',
];

function LandingPage() {
  const isSection = (idx) => (idx < 4 ? `/section/${idx}` : '/ticket');
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (typeof user.userData !== 'undefined') {
      if (typeof user.userData.name !== 'undefined') {
        if (localStorage.getItem('msg') === 'true') {
          message.success(`${user.userData.name || 'Guest'}님 환영합니다`, 3);
          localStorage.setItem('msg', false);
        }
      }
    }
  }, [user.userData])

  return (
    <App>
      <Title>
        {user.userData !== undefined ? (
          `${user.userData.name || 'Guest'}님 환영합니다`
        ) : (
            <LoadingIcon small='true' />
          )}
      </Title>
      <CardContainer gutter={[0, 0]}>
        {sectionName.map((section, idx) => (
          <Card md={6} sm={12} xs={12} key={idx}>
            <StyledLink to={isSection(idx + 1)} draggable='false' key={idx}>
              <Img
                src={`/images/${idx + 1}.jpg`}
                draggable='false'
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `/images/${idx + 1}.png`;
                }}
                alt={sectionName[idx]}
                style={{ objectFit: 'cover' }}
              />
              <CardTitle>{section}</CardTitle>
              <Blur />
            </StyledLink>
          </Card>
        ))}
      </CardContainer>
    </App>
  );
}

export default LandingPage;
