import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { useHistory } from 'react-router-dom';

import { PlusOutlined } from '@ant-design/icons';
import { SERVER } from '@common/config';
import { sectionName } from '@containers/Home';
import { Button, Form, Input, message, Select, Typography } from 'antd';
import axios from 'axios';
import styled from 'styled-components';
/* eslint-disable react/jsx-props-no-spreading */
const { Title } = Typography;

const SectionOptions = [
  { value: 1, label: sectionName[0] },
  { value: 2, label: sectionName[1] },
  { value: 3, label: sectionName[2] },
];

const App = styled.div`
  max-width: 320px;
  margin: 2rem auto;
  text-align: center;
`;

const DropBox = styled.div`
  width: 320px;
  height: 180px;
  border: 1px solid lightgray;
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 30px;
  align-items: center;
  justify-content: center;
`;

const StyledInput = styled(Input)`
  margin-bottom: 20px !important;
  border-radius: 4px !important;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
`;

const StyledSelect = styled(Select)`
  width: 100%;
  & .ant-select-selector {
    border-radius: 4px !important;
  }
  margin-bottom: 30px !important;
  text-align: left;
`;

function MenuUploadPage() {
  const history = useHistory();
  const [Name, setName] = useState('');
  const [Section, setSection] = useState(1);
  const [Price, setPrice] = useState('');
  const [File, setFile] = useState<any>(null);
  const [Preview, setPreview] = useState('');

  const onPriceChange = (e: any) => {
    const { value } = e.currentTarget;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      setPrice(value);
    }
  };

  const onSectionChange = (value: any) => {
    setSection(value);
  };

  const onDrop = (files: any) => {
    if (files[0] === undefined) {
      alert('3MB 이하의 파일만 업로드 할 수 있습니다.');
      return;
    }
    setName(files[0].name.split('.')[0]);
    setFile(files[0]);
    setPreview(URL.createObjectURL(files[0]));
  };

  const onSubmit = (e: any) => {
    e.preventDefault();

    if (File === null) {
      alert('사진을 업로드 해주세요');
      return;
    }
    if (Number(Price) < 500) {
      alert('음식 가격은 500원 이상이어야 합니다');
      setPrice('');
      return;
    }

    const formData = new FormData();
    formData.append('file', File);

    axios.post(`${SERVER}/api/menus/uploadfiles`, formData).then((response) => {
      if (response.data.success) {
        const variable = {
          name: Name.split('.')[0],
          url: response.data.url,
          price: Price,
          section: Section,
        };

        axios.post(`${SERVER}/api/menus/savefiles`, variable).then((_response: any) => {
          if (_response.data.success) {
            message.success('업로드 완료.');
            setTimeout(() => {
              history.push('/');
            }, 1500);
          }
        });
      } else {
        alert('업로드를 실패.');
      }
    });
  };

  return (
    <App>
      <Title level={2}>Upload Menu</Title>
      <Form>
        <Dropzone accept="image/*" maxSize={3072000} multiple={false} onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
            <DropBox {...getRootProps()}>
              <input {...getInputProps()} />
              {Preview && <img alt="" src={Preview} style={{ height: '100%' }} />}
              {!Preview && <PlusOutlined style={{ fontSize: '3rem' }} />}
            </DropBox>
          )}
        </Dropzone>
        <StyledInput disabled placeholder="File name" value={Name} />
        <StyledInput
          maxLength={5}
          onChange={onPriceChange}
          placeholder="Only number"
          // suffix='원'
          prefix="₩"
          value={Price}
        />
        <StyledSelect defaultValue={SectionOptions[0].label} onChange={onSectionChange}>
          {SectionOptions.map((item) => (
            <Select.Option key={item.value} value={item.value}>
              {item.label}
            </Select.Option>
          ))}
        </StyledSelect>
        <Button onClick={onSubmit} style={{ width: '100%' }} type="primary">
          Submit
        </Button>
      </Form>
    </App>
  );
}

export default MenuUploadPage;
