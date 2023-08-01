import { memo } from 'react';
import ConfirmModal from './ConfirmModal';

function WrapConfirmModal({ children, ...data }) {
    return (
        <>
            <ConfirmModal {...data} />
            <div
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
                className="btn-delete-noline btn-outline-danger"
            >
                {children}
            </div>
        </>
    );
}

export default memo(WrapConfirmModal);
