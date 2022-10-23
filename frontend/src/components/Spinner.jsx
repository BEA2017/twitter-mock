import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Spinner = () => <Spin indicator={antIcon} />;

export default Spinner;
