import {
    ORDER_ADDRESS_MY_FAIL,
    ORDER_ADDRESS_MY_REQUEST,
    ORDER_ADDRESS_MY_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_LIST_MY_FAIL,
    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_LIST_ALL_FAIL,
    ORDER_LIST_ALL_REQUEST,
    ORDER_LIST_ALL_SUCCESS,
    ORDER_CANCEL_REQUEST,
    ORDER_CANCEL_SUCCESS,
    ORDER_CANCEL_FAIL,
    ORDER_CONFIRM_PAID_REQUEST,
    ORDER_CONFIRM_PAID_SUCCESS,
    ORDER_CONFIRM_PAID_FAIL,
} from '../Constants/OrderConstants';
import { CART_CLEAR_ITEMS, CART_ORDER_RESET } from '../Constants/CartConstants';
import { logout } from './userActions';
import request from '../../utils/request';
import { toast } from 'react-toastify';
import { Toastobjects } from '~/components/LoadingError/Toast';

// CREATE ORDER
export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_CREATE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.accessToken}`,
            },
        };

        const { data } = await request.post(`/api/order`, order, config);
        toast.success('Successful order', Toastobjects);
        dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
        dispatch({ type: CART_ORDER_RESET });
        localStorage.removeItem('cartOrderItems');
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (message === 'Not authorized, token failed') {
            dispatch(logout());
        }
        toast.error(message, Toastobjects);
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: message,
        });
    }
};

// ORDER DETAILS
export const getOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_DETAILS_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.accessToken}`,
            },
        };

        const { data } = await request.get(`/api/order/${id}`, config);
        dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (message === 'Not authorized, token failed') {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: message,
        });
    }
};

// ORDER PAY
export const payOrder = (orderId, paymentResult) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_PAY_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.accessToken}`,
            },
        };

        const { data } = await request.put(`/api/order/${orderId}/pay`, paymentResult, config);
        dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (message === 'Not authorized, token failed') {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_PAY_FAIL,
            payload: message,
        });
    }
};

// USER ORDERS
export const listMyOrders =
    ({ pageNumber }) =>
    async (dispatch, getState) => {
        try {
            dispatch({ type: ORDER_LIST_MY_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.accessToken}`,
                },
            };

            const { data } = await request.get(`/api/order?pageSize=20&&pageNumber=${pageNumber}`, config);
            dispatch({ type: ORDER_LIST_MY_SUCCESS, payload: data });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            if (message === 'Not authorized, token failed') {
                dispatch(logout());
            }
            dispatch({
                type: ORDER_LIST_MY_FAIL,
                payload: message,
            });
        }
    };

//GET ORDER
export const orderGetAddress = () => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_ADDRESS_MY_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.accessToken}`,
            },
        };

        const { data } = await request.get(`/api/order/${userInfo._id}/address`, config);
        dispatch({ type: ORDER_ADDRESS_MY_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (message === 'Not authorized, token failed') {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_ADDRESS_MY_FAIL,
            payload: message,
        });
    }
};

// ODERS LIST ALL
export const listAllOrder = () => async (dispatch) => {
    try {
        dispatch({ type: ORDER_LIST_ALL_REQUEST });
        const { data } = await request.get(`/api/product?bestSeller=true`);
        dispatch({ type: ORDER_LIST_ALL_SUCCESS, payload: data?.products });
    } catch (error) {
        dispatch({
            type: ORDER_LIST_ALL_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const cancelOrder =
    ({ orderId }) =>
    async (dispatch, getState) => {
        try {
            dispatch({ type: ORDER_CANCEL_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.accessToken}`,
                },
            };

            const { data } = await request.patch(`/api/order/${orderId}/cancel`, { orderId }, config);
            dispatch({ type: ORDER_CANCEL_SUCCESS, payload: data });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            if (message === 'Not authorized, token failed') {
                dispatch(logout());
            }
            dispatch({
                type: ORDER_CANCEL_FAIL,
                payload: message,
            });
        }
    };

export const confirmPaid =
    ({ orderId }) =>
    async (dispatch, getState) => {
        try {
            dispatch({ type: ORDER_CONFIRM_PAID_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.accessToken}`,
                },
            };

            const { data } = await request.patch(`/api/order/${orderId}`, { status: 'Paid' }, config);
            dispatch({ type: ORDER_CONFIRM_PAID_SUCCESS, payload: data });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            if (message === 'Not authorized, token failed') {
                dispatch(logout());
            }
            dispatch({
                type: ORDER_CONFIRM_PAID_FAIL,
                payload: message,
            });
        }
    };
