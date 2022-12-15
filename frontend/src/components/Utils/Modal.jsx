import { CloseOutlined } from '@ant-design/icons';
import '../../App.scss';

export const Modal = ({ children, title, cancel }) => {
	return (
		<div className="modal_shadow">
			<div className="modal">
				<div className="modal-header">
					<div className="modal_title">{title}</div>
					<div className="modal_cancel" onClick={cancel} style={{ cursor: 'pointer' }}>
						<CloseOutlined />
					</div>
				</div>
				<div className="modal_content">{children}</div>
			</div>
		</div>
	);
};
