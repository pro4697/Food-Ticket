import React from 'react';

import { SERVER } from '@common/config';
import { BgColor, FadeIn } from '@common/Style_Etc';
import { Button, Col, Row } from 'antd';
import styled from 'styled-components';

import { TMenuType } from '.';

const StyledRow = styled(Row)`
  display: flex;
  width: 100% !important;
  height: 100%;
  transition: 1s;
  margin-bottom: 50px !important;
`;

const StyledCol = styled(Col)`
  -webkit-animation: ${FadeIn} 0.3s ease;
  -moz-animation: ${FadeIn} 0.3s ease;
  -ms-animation: ${FadeIn} 0.3s ease;
  -o-animation: ${FadeIn} 0.3s ease;
  animation: ${FadeIn} 0.3s ease;
`;

const Img = styled.img`
  display: block;
  border-radius: 10px;
  margin-bottom: 5px;
  width: 100%;
  z-index: 0;
  box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.3), 0 -6px 16px -6px rgba(0, 0, 0, 0.025);
`;

const ItemInfo = styled.div`
  display: block;
  overflow: hidden;
  position: relative;
  border: 0;
  border-radius: 30px;
  text-align: center;
  background-color: white;
  width: 80%;
  margin: -30px auto 0 auto;
  z-index: 1;
  -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.3), 0 -6px 16px -6px rgba(0, 0, 0, 0.025);
`;

const Item = styled(Button)`
  display: flex;
  padding: 0 !important;
  flex-direction: column;
  align-items: center;
  border: 0 !important;
  width: 100% !important;
  height: 100% !important;
  color: black !important;
  &:hover ${ItemInfo}, &:focus ${ItemInfo} {
    border-color: ${(props) => props.color} !important;
    background-color: ${(props) => props.color} !important;
    color: white !important;
  }
`;

const ItemTitle = styled.div`
  display: block;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 2px;
  @media (max-width: 1200px) {
    font-size: 13px;
  }
  @media (max-width: 767px) {
    font-size: 13px;
  }
`;

const ItemPrice = styled.div`
  display: block;
  font-size: 14px;
  letter-spacing: 2px;
  margin-left: -5px;
  @media (max-width: 992px) {
    font-size: 13px;
  }
  @media (max-width: 767px) {
    font-size: 12px;
  }
`;

type TMenuContainer = {
  menu: TMenuType[];
  onClick: (e: any) => void;
};

// xs sm md lg xl xxl
function MenuContainer({ menu, onClick }: TMenuContainer) {
  return (
    <StyledRow gutter={[32, 32]} justify="center">
      {menu.map((item, idx) => (
        <StyledCol key={item.name} lg={6} md={6} sm={8} xl={4} xs={12}>
          <Item color={BgColor[idx % BgColor.length]} onClick={onClick} value={idx}>
            <Img alt={item.name} draggable="false" src={`${SERVER}/${item.url}`} />
            <ItemInfo>
              <ItemTitle>{item.name}</ItemTitle>
              <ItemPrice>₩ {item.price}</ItemPrice>
            </ItemInfo>
          </Item>
        </StyledCol>
      ))}
    </StyledRow>
  );
}

export default MenuContainer;
