import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Spinner = () => (
	<div
		style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
		className="spinner">
		<Spin indicator={antIcon} />
	</div>
);

export default Spinner;
