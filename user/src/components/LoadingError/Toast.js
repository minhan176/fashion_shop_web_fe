import React from 'react';
import { ToastContainer } from 'react-toastify';

const Toast = () => {
    return (
        <div>
            <ToastContainer position="top-right" hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} />
            {/* Same as */}
            <ToastContainer />
        </div>
    );
};

export default Toast;

export const Toastobjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 2000,
};
