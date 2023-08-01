import { toast } from 'react-toastify';
import request from '../../utils/request';
import {
    CART_ADD_PRODUCT_ORDER_REQUEST,
    CART_ADD_PRODUCT_ORDER_SUCCESS,
    CART_CLEAR_SUCCESS,
    CART_CREATE_FAIL,
    CART_CREATE_REQUEST,
    CART_CREATE_SUCCESS,
    CART_DELETE_FAIL,
    CART_DELETE_REQUEST,
    CART_DELETE_SUCCESS,
    CART_LIST_FAIL,
    CART_LIST_REQUEST,
    CART_LIST_SUCCESS,
    CART_ORDER_RESET,
    CART_ORDER_SHIPPING_ADDRESS,
    CART_REMOVE_ITEM,
    CART_SAVE_PAYMENT_METHOD,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_UPDATE_REQUEST,
    CART_UPDATE_SUCCESS,
} from '../Constants/CartConstants';
import { logout } from './userActions';

const Toastobjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 2000,
};

export const listCart = () => async (dispatch, getState) => {
    try {
        dispatch({ type: CART_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.accessToken}`,
            },
        };

        const { data } = await request.get(`/api/cart`, config);
        localStorage.setItem('cartItems', JSON.stringify(data));

        dispatch({ type: CART_LIST_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (message === 'Not authorized, token failed') {
            dispatch(logout());
        }
        dispatch({
            type: CART_LIST_FAIL,
            payload: message,
        });
    }
};
//ADD TO CART NEW
export const addToCart = (variantId, qty, history) => async (dispatch, getState) => {
    try {
        dispatch({ type: CART_CREATE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();
        const { _id } = userInfo;
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.accessToken}`,
            },
        };

        const { data } = await request.post(`/api/cart/add`, { variantId, quantity: qty }, config);
        toast.success('Register success', Toastobjects);

        setTimeout(() => {
            history.push(`/cart/${variantId}?qty=${qty}`);
            dispatch({ type: CART_CREATE_SUCCESS });
        }, 200);
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (message === 'Not authorized, token failed') {
            dispatch(logout());
        }
        dispatch({
            type: CART_CREATE_FAIL,
            payload: message,
        });
        toast.error(message, { ...Toastobjects, autoClose: 3000 });
    }
};

export const updateCart =
    ({ variantId, qty, setCartChoise, setLoadingIndices, updateCart }) =>
    async (dispatch, getState) => {
        try {
            dispatch({ type: CART_UPDATE_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();
            const { _id } = userInfo;
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.accessToken}`,
                },
            };
            const { data } = await request.patch(`/api/cart/update`, { variantId, quantity: qty }, config);
            if (updateCart == true && data)
                setCartChoise((pre) => {
                    if (pre[variantId] !== undefined) pre[variantId].quantity = qty;
                    return { ...pre };
                });
            dispatch({ type: CART_UPDATE_SUCCESS });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            if (message === 'Not authorized, token failed') {
                dispatch(logout());
            }
            setLoadingIndices(null);
            toast.error(message, { ...Toastobjects, autoClose: 3000 });
            dispatch({
                type: CART_CREATE_FAIL,
                payload: message,
            });
        }
    };

// REMOVE PRODUCT FROM CART
export const removefromcart =
    ({ id, setCartChoise, deleteCartOnly, deleteCartAll }) =>
    async (dispatch, getState) => {
        try {
            dispatch({ type: CART_DELETE_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.accessToken}`,
                },
            };
            const { data } = await request.patch(
                `/api/cart/remove`,
                {
                    variantIds: id,
                },
                config,
            );
            if (deleteCartOnly === true && data)
                setCartChoise((pre) => {
                    delete pre[id[0]];
                    return { ...pre };
                });
            else {
                if (data && deleteCartAll === true) setCartChoise([]);
            }
            dispatch({ type: CART_DELETE_SUCCESS, payload: data });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            if (message === 'Not authorized, token failed') {
                dispatch(logout());
            }
            dispatch({
                type: CART_DELETE_FAIL,
                payload: message,
            });
        }

        localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
    };

//Delete all item from cart
export const clearFromCart = () => async (dispatch, getState) => {
    try {
        dispatch({ type: CART_ORDER_RESET });

        localStorage.removeItem('cartOrderItems');
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (message === 'Not authorized, token failed') {
            dispatch(logout());
        }
    }

    localStorage.setItem('cartOrderItems', JSON.stringify(getState().cart.cartItems));
};
// SAVE SHIPPING ADDRESS
export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data,
    });
    localStorage.setItem('shippingAddress', JSON.stringify(data));
};

// SAVE PAYMENT METHOD
export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data,
    });

    localStorage.setItem('paymentMethod', JSON.stringify(data));
};

export const addProductOrderInCart = (data) => (dispatch) => {
    dispatch({
        type: CART_ADD_PRODUCT_ORDER_SUCCESS,
        payload: data,
    });

    localStorage.setItem('cartOrderItems', JSON.stringify(data));
};

export const listOrderCart = () => async (dispatch, getState) => {
    try {
        // dispatch({ type: CART_LIST_REQUEST });

        const data = JSON.parse(localStorage.getItem('cartOrderItems'));

        dispatch({ type: CART_ADD_PRODUCT_ORDER_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (message === 'Not authorized, token failed') {
            dispatch(logout());
        }
        dispatch({
            type: CART_LIST_FAIL,
            payload: message,
        });
    }
};
