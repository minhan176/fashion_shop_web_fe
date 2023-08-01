import React from 'react';
import { useDispatch } from 'react-redux';
import Toast from '../components/LoadingError/Toast';
import { cancelRegister, confirmRegister } from '../Redux/Actions/userActions';

export default function ConfirmRegister({ location, history }) {
    const dispatch = useDispatch();
    const emailVerificationToken = location.search ? location.search.split('=')[1] : 1;
    const handleConfirm = () => {
        dispatch(confirmRegister(emailVerificationToken.toString(), history));
        // history.push('/login');
    };

    const handleCancel = () => {
        dispatch(cancelRegister(emailVerificationToken.toString(), history));
    };
    return (
        <>
            <Toast />
            <div
                className="container d-flex flex-column justify-content-center align-items-center login-center"
                style={{ height: '80VH' }}
            >
                <form className="Login col-md-6 col-lg-4 col-10">
                    <h4 style={{ marginBottom: '15PX' }}>Do you want to register account in Fashionshop?</h4>
                    <div className="d-flex justify-content-between">
                        <div className="btn btn-outline-danger btn__login" onClick={handleCancel}>
                            NO
                        </div>
                        <div className="btn"></div>
                        <div className="btn btn-outline-primary btn__login" onClick={handleConfirm}>
                            YES
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}
