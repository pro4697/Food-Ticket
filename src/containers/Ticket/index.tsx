/* eslint-disable max-len */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { TReducer } from '@/redux';
import { SERVER } from '@common/config';
import { BgColor, BoxIcon, FadeIn, LoadingIcon, StyledApp } from '@common/Style_Etc';
import { sectionName } from '@containers/Home';
import { Button, Col, message, Modal, Row, Typography } from 'antd';
import axios from 'axios';
import QRCode from 'qrcode.react';
import styled from 'styled-components';

type TicketType = {
  section: number;
  name: string;
  date: string;
  url: string;
  key: string;
};

const { Title } = Typography;

const StyledRow = styled(Row)`
  width: 85%;
  height: 100%;
  margin-top: 100px !important;
  @media (max-width: 767px) {
    margin-top: 30px !important;
    margin-bottom: 40px !important;
  }
`;

const StyledCol = styled(Col)`
  -webkit-animation: ${FadeIn} 0.3s ease;
  -moz-animation: ${FadeIn} 0.3s ease;
  -ms-animation: ${FadeIn} 0.3s ease;
  -o-animation: ${FadeIn} 0.3s ease;
  animation: ${FadeIn} 0.3s ease;
`;

const Item = styled(Button)`
  display: flex;
  padding: 0 !important;
  flex-direction: column;
  align-items: center;
  border-radius: 5px !important;
  width: 100% !important;
  height: 100% !important;
  box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.3), 0 -6px 16px -6px rgba(0, 0, 0, 0.025) !important;
  &:hover,
  &:focus {
    border-color: ${({ color }) => color} !important;
    background-color: ${({ color }) => color} !important;
    color: white !important;
  }
`;

const ItemInfo = styled.span`
  display: flex;
  font-size: 14px;
  letter-spacing: 2px;
  @media (max-width: 992px) {
    font-size: 13px;
  }
  @media (max-width: 767px) {
    font-size: 12px;
  }
`;

const Img = styled.img`
  display: flex;
  width: 100%;
  border-radius: 5px;
  margin: auto 0;
`;

const QrCode = styled(QRCode)`
  display: flex;
  margin: auto;
`;

function TicketPage() {
  const user = useSelector((state: TReducer) => state.user);
  const [Ticket, setTicket] = useState<TicketType[]>([]);
  const [Visible, setVisible] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [PopupData, setPopupData] = useState<TicketType>();
  const [TrashValue, setTrashValue] = useState(2);
  const [IntervalId, setIntervalId] = useState<any>();

  const getTicket = (userData: TReducer['user']['userData']) => {
    if (userData !== undefined) {
      axios
        .get(`${SERVER}/api/tickets/ticket`, {
          params: {
            userId: userData._id,
          },
        })
        .then((response) => {
          if (response.data.success) {
            setTicket(response.data.result);
            setLoading(true);
          } else {
            alert('식권 정보 불러오기 실패');
          }
        });
    }
  };

  // mount
  useEffect(() => {
    if (!Loading && user.userData?.error === undefined) {
      getTicket(user.userData);
    }
  }, [user]);

  // unmount
  useEffect(
    () => () => {
      clearInterval(IntervalId);
    },
    [IntervalId],
  );

  const onClick = (e: any) => {
    setPopupData(Ticket[e.currentTarget.value]);
    setVisible(true);

    /// ///////////////////////////////////////////////////////////
    //                        polling                           //
    /// ///////////////////////////////////////////////////////////

    // 같은 블럭내에서 setTimeout을 사용해야 하므로 해당 변수 선언
    let thisInterval: NodeJS.Timeout;

    const { key } = Ticket[e.currentTarget.value];

    // 식권 사용시 자동 닫힘
    setIntervalId(
      (thisInterval = setInterval(() => {
        setTrashValue(Math.floor(Math.random() * 10));
        axios.post(`${SERVER}/api/tickets/check`, { key }).then((response) => {
          if (!response.data.success) {
            setVisible(false);
            clearInterval(thisInterval);
            getTicket(user.userData);
            message.success('식권 사용 완료', 0.75);
          }
        });
      }, 2500)),
    );

    // 자동닫기 기능은 45초간 동작
    setTimeout(() => {
      clearInterval(thisInterval);
      // clearInterval(thisInterval);
    }, 45000);
    /// ///////////////////////////////////////////////////////////
    //                                                          //
    /// ///////////////////////////////////////////////////////////
  };

  if (Loading && Ticket.length > 0) {
    return (
      <StyledApp>
        <StyledRow gutter={[16, 16]} justify="center">
          {Ticket.map((ticket, idx) => (
            <StyledCol key={ticket.key} lg={4} md={6} sm={8} xs={12}>
              <Item color={BgColor[idx % BgColor.length]} onClick={onClick} value={idx}>
                <ItemInfo>{sectionName[ticket.section - 1]}</ItemInfo>
                <Img alt={ticket.name} draggable="false" src={`${SERVER}/${ticket.url}`} />
                <ItemInfo>{ticket.name}</ItemInfo>
              </Item>
            </StyledCol>
          ))}
        </StyledRow>
        <Modal
          centered
          footer={[
            <Button
              key="ok"
              onClick={() => {
                setVisible(false);
                clearInterval(IntervalId);
              }}
              type="primary"
            >
              OK
            </Button>,
          ]}
          onCancel={() => {
            setVisible(false);
            clearInterval(IntervalId);
          }}
          title={`${PopupData?.name} / ${sectionName[(PopupData?.section || 1) - 1]}`}
          visible={Visible}
        >
          <QrCode
            imageSettings={{
              src: '/favicon.ico',
              x: undefined,
              y: undefined,
              height: 40,
              width: 40,
              excavate: true,
            }}
            level="M"
            value={`${PopupData?.name}^${PopupData?.key}^${TrashValue}`}
          />
          <br />
          <div style={{ textAlign: 'center' }}>{String(PopupData?.date).slice(3, 17)}</div>
        </Modal>
      </StyledApp>
    );
  }
  return (
    <StyledApp>
      {Loading && (
        <>
          <BoxIcon />
          <Title level={2}>보유한 식권이 없습니다.</Title>
        </>
      )}
      {!Loading && <LoadingIcon />}
    </StyledApp>
  );
}

export default TicketPage;
