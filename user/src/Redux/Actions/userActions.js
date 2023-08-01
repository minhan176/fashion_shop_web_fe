import {
    FORGOT_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    USER_DETAILS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_RESET,
    USER_DETAILS_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_VERIFY,
    USER_UPDATE_PASSWORD_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
} from '../Constants/UserContants';
import { ORDER_LIST_MY_RESET } from '../Constants/OrderConstants';
import { CART_LIST_MY_RESET } from '../Constants/CartConstants';
import { toast } from 'react-toastify';
import request from '../../utils/request';

const Toastobjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 2000,
};
// LOGIN
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await request.post(`/api/user/login`, { email, password }, config);
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        // dispatch(listCart());
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: message,
        });
        toast.error(message, Toastobjects);
    }
};

// LOGOUT
export const logout = () => (dispatch) => {
    try {
        setTimeout(() => {
            dispatch({ type: USER_LOGIN_REQUEST });
        }, 100);
        setTimeout(() => {
            localStorage.removeItem('userInfo');
            dispatch({ type: USER_LOGOUT });
            dispatch({ type: USER_DETAILS_RESET });
            dispatch({ type: ORDER_LIST_MY_RESET });
            dispatch({ type: CART_LIST_MY_RESET });
        }, 500);
    } catch (error) {
        toast.error(
            error.response && error.response.data.message ? error.response.data.message : error.message,
            Toastobjects,
        );
    }
};

// REGISTER
export const register = (history, name, email, phone, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await request.post(`/api/user/register`, { name, email, password, phone }, config);
        dispatch({ type: USER_REGISTER_VERIFY });
        // dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        history.push(`/register/verify?email=${email}`);

        // localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: message,
        });
        toast.error(message, Toastobjects);
    }
};

export const confirmRegister = (verifyEmail, history) => async (dispatch) => {
    try {
        // dispatch({ type: USER_REGISTER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await request.patch(
            `/api/user/auth/verify-email?emailVerificationToken=${verifyEmail}`,
            config,
        );
        toast.success('Register success', Toastobjects);
        // dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
        // dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        setTimeout(() => {
            history.push('/login');
        }, 2000);
        // localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;

        // dispatch({
        //     type: USER_REGISTER_FAIL,
        //     payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        // });
        toast.error(message, Toastobjects);
        setTimeout(() => {
            history.push('/login');
        }, 2000);
    }
};

export const cancelRegister = (verifyEmail, history) => async (dispatch) => {
    try {
        // dispatch({ type: USER_REGISTER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await request.patch(
            `/api/user/auth/cancel-verify-email?emailVerificationToken=${verifyEmail}`,
            config,
        );
        history.push('/login');
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;

        // dispatch({
        //     type: USER_REGISTER_FAIL,
        //     payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        // });
        setTimeout(() => {
            history.push('/login');
        }, 2000);
    }
};

export const forGotPassWord = (data, history) => async (dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const apiData = await request.patch(`/api/user/auth/forgot-password`, { email: data.emailReset }, config);
        dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: apiData });

        toast.success('Verify email to reset password is sent, please check your inbox', Toastobjects);
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;

        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
        toast.error(message, Toastobjects);
    }
};

export const resetPassWord = (resetPasswordToken, data, history) => async (dispatch) => {
    try {
        dispatch({ type: RESET_PASSWORD_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const dataApi = await request.patch(
            `api/user/auth/reset-password?resetPasswordToken=${resetPasswordToken}`,
            { ...data },
            config,
        );
        dispatch({ type: RESET_PASSWORD_SUCCESS, payload: dataApi });
        toast.success('Reset is success', Toastobjects);
        setTimeout(() => {
            history.push('/login');
        }, 1500);
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;

        dispatch({
            type: RESET_PASSWORD_FAIL,
            payload: message,
        });
        toast.error(message, Toastobjects);
    }
};

// USER DETAILS
export const getUserDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_DETAILS_REQUEST });
        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.accessToken}`,
            },
        };

        const { data } = await request.get(`/api/user/${id}`, config);
        dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (message === 'Not authorized, token failed') {
            dispatch(logout());
        }
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: message,
        });
    }
};

// UPDATE PROFILE
export const updateUserProfile = (user, history) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.accessToken}`,
            },
        };

        const { data } = await request.put(`/api/user/profile`, user, config);
        if (data && history) history.push('/payment');
        if (!history) toast.success('Profile Updated', Toastobjects);
        dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: { ...data, accessToken: userInfo.accessToken } });
        dispatch({ type: USER_LOGIN_SUCCESS, payload: { ...data, accessToken: userInfo.accessToken } });
        localStorage.setItem('userInfo', JSON.stringify({ ...data, accessToken: userInfo.accessToken }));
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (message === 'Not authorized, token failed') {
            dispatch(logout());
        }
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: message,
        });
        toast.error(message, Toastobjects);
    }
};

export const updateUserPassword = (user) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.accessToken}`,
            },
        };

        const { data } = await request.patch(`/api/user/auth/change-password`, user, config);
        dispatch({ type: USER_UPDATE_PASSWORD_SUCCESS, payload: { ...userInfo, accessToken: userInfo.accessToken } });
        // dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        toast.success('Update password success', Toastobjects);
        localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, accessToken: data.token }));
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;

        if (message === 'Not authorized, token failed') {
            dispatch(logout());
        }
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: message,
        });
        toast.error(message, Toastobjects);
    }
};
