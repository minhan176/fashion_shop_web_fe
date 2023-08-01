import {
    CART_ADD_PRODUCT_ORDER_FAIL,
    CART_ADD_PRODUCT_ORDER_REQUEST,
    CART_ADD_PRODUCT_ORDER_SUCCESS,
    CART_CLEAR_SUCCESS,
    // CART_ADD_ITEM,
    // CART_CLEAR_ITEMS,
    CART_CREATE_FAIL,
    CART_CREATE_REQUEST,
    CART_CREATE_SUCCESS,
    CART_DELETE_FAIL,
    CART_DELETE_REQUEST,
    CART_DELETE_SUCCESS,
    CART_LIST_FAIL,
    CART_LIST_MY_RESET,
    CART_LIST_REQUEST,
    CART_LIST_SUCCESS,
    CART_ORDER_RESET,
    CART_ORDER_SHIPPING_ADDRESS,
    // CART_REMOVE_ITEM,
    CART_SAVE_PAYMENT_METHOD,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_UPDATE_FAIL,
    CART_UPDATE_REQUEST,
    CART_UPDATE_RESET,
    CART_UPDATE_SUCCESS,
} from '../Constants/CartConstants';

export const cartReducer = (state = { cartItems: [] }, action) => {
    switch (action.type) {
        case CART_LIST_REQUEST:
            const newCart = state?.cartItems?.length != 0 ? state?.cartItems : [];
            return { loading: true, cartItems: newCart };
        case CART_LIST_SUCCESS:
            return { loading: false, cartItems: action.payload };
        case CART_LIST_FAIL:
            return { loading: false, error: action.payload };
        case CART_SAVE_SHIPPING_ADDRESS:
            return {
                ...state,
                shippingAddress: action.payload,
            };
        case CART_SAVE_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload,
            };
        case CART_LIST_MY_RESET:
            return { cartItems: [] };
        default:
            return state;
    }
};

export const DeleteCartReducer = (state = {}, action) => {
    switch (action.type) {
        case CART_DELETE_REQUEST:
            return { loading: true };
        case CART_DELETE_SUCCESS:
            return { loading: false, success: true, message: action.payload };
        case CART_DELETE_FAIL:
            return { loading: false, error: true };
        case CART_CLEAR_SUCCESS:
            return { loading: false, success: true };
        default:
            return state;
    }
};

export const CreateCartReducer = (state = {}, action) => {
    switch (action.type) {
        case CART_CREATE_REQUEST:
            return { loading: true };
        case CART_CREATE_SUCCESS:
            return {
                loading: false,
                success: true,
            };
        case CART_CREATE_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const UpdateCartReducer = (state = {}, action) => {
    switch (action.type) {
        case CART_UPDATE_REQUEST:
            return { loading: true };
        case CART_UPDATE_SUCCESS:
            return {
                loading: false,
                success: true,
            };
        case CART_UPDATE_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CART_UPDATE_RESET:
            return {};
        default:
            return state;
    }
};

export const CartOrderReducer = (state = { cartOrderItems: [], shippingAddress: {} }, action) => {
    switch (action.type) {
        case CART_ADD_PRODUCT_ORDER_REQUEST:
            return { ...state, loading: true };
        case CART_ADD_PRODUCT_ORDER_SUCCESS:
            return {
                loading: false,
                success: true,
                cartOrderItems: action.payload,
            };
        case CART_SAVE_SHIPPING_ADDRESS:
            return {
                ...state,
                shippingAddress: action.payload,
            };
        case CART_ADD_PRODUCT_ORDER_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CART_ORDER_RESET:
            return { cartOrderItems: [], shippingAddress: {} };
        default:
            return state;
    }
};
