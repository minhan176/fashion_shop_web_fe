import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { clearFromCart, listCart, listOrderCart } from '../Redux/Actions/cartActions';
import { createOrder } from '../Redux/Actions/OrderActions';
import { ORDER_CREATE_RESET } from '../Redux/Constants/OrderConstants';
import Header from './../components/Header';
import Message from './../components/LoadingError/Error';
import { getUserDetails } from '../Redux/Actions/userActions';
import WrapConfirmModal from '~/components/Modal/WrapConfirmModal';
import Toast from '~/components/LoadingError/Toast';

const PlaceOrderScreen = ({ history }) => {
    window.scrollTo(0, 0);
    // const userDetails = useSelector((state) => state.userDetails);
    // const { loading, user } = userDetails;
    const dispatch = useDispatch();
    const cartOrder = useSelector((state) => state.cartOrder);
    const { cartOrderItems } = cartOrder;
    const currenCartItems = cartOrderItems;
    const createContent = useCallback(() => {
        return { title: 'Place order this product?', body: 'Are you sure?' };
    });
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    // Calculate Price
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };
    cartOrder.itemsPrice = addDecimals(
        cartOrder.cartOrderItems.reduce((totalPrice, i) => totalPrice + i.quantity * i.variant.price, 0).toFixed(2),
    );
    cartOrder.shippingPrice = addDecimals(cartOrder.itemsPrice > 0 ? (cartOrder.itemsPrice > 100 ? 0 : 20) : 0);
    cartOrder.taxPrice = addDecimals(Number((0.15 * cartOrder.itemsPrice).toFixed(2)));
    cartOrder.totalPrice =
        cartOrder?.cartOrderItems.length > 0
            ? (Number(cartOrder.itemsPrice) + Number(cartOrder.shippingPrice) + Number(cartOrder.taxPrice)).toFixed(2)
            : 0;

    const orderCreate = useSelector((state) => state.orderCreate);
    const { order, success, error } = orderCreate;

    useEffect(() => {
        dispatch(listOrderCart());
        dispatch(listCart());
    }, []);
    useEffect(() => {
        // dispatch(getUserDetails('profile'));

        if (success) {
            history.push(`/order/${order._id}`);
            dispatch({ type: ORDER_CREATE_RESET });
        }
    }, [history, dispatch, success, order]);

    const placeOrderHandler = () => {
        //if (window.confirm("Are you sure"))
        dispatch(
            createOrder({
                orderItems: currenCartItems,
                shippingAddress: {
                    address: userInfo.address,
                    city: userInfo.city,
                    postalCode: '',
                    country: userInfo.country,
                },

                paymentMethod: 'Payment in cash',
                taxPrice: cartOrder.taxPrice,
                shippingPrice: cartOrder.shippingPrice,
                totalPrice: cartOrder.totalPrice,
                contactInformation: {
                    email: userInfo.email,
                    phone: userInfo.phone,
                },
            }),
        );
        // dispatch(clearFromCart(userInfo._id));
    };
    return (
        <>
            <Toast />
            <Header />
            <div className="container">
                {/* <PayModal
                    Title="PAY"
                    Body="Do you agree to pay?"
                    HandleSubmit={placeOrderHandler}
                    Close="modal"
                ></PayModal> */}
                <div className="row  order-detail">
                    <div className="col-lg-4 col-sm-4 mb-lg-4 mb-2 mb-sm-0 fix-bottom">
                        <div className="row " style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="col-lg-3 col-sm-3 mb-lg-3 center fix-bottom">
                                <div className="alert-success order-box fix-none">
                                    <i class="fas fa-user"></i>
                                </div>
                            </div>
                            <div className="col-lg-9 col-sm-9 mb-lg-9 fix-display">
                                <p>{`Name: ${userInfo.name}`}</p>
                                <p>{`Phone: ${userInfo.phone}`}</p>
                            </div>
                        </div>
                    </div>
                    {/* 2 */}
                    <div className="col-lg-4 col-sm-4 mb-lg-4 mb-2 mb-sm-0 fix-bottom">
                        <div
                            className="row"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}
                        >
                            <div className="col-lg-3 col-sm-3 mb-lg-3 center fix-bottom">
                                <div className="alert-success order-box fix-none">
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                            </div>
                            <div className="col-lg-9 col-sm-9 mb-lg-9">
                                <p>Address: {`${userInfo?.city}, ${userInfo?.address}, ${userInfo?.country}`}</p>
                            </div>
                        </div>
                    </div>
                    {/* 3 */}
                    <div className="col-lg-4 col-sm-4 mb-lg-4 mb-2 mb-sm-0 fix-bottom">
                        <div className="row" style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="col-lg-3 col-sm-3 mb-lg-3 center fix-bottom">
                                <div className="alert-success order-box fix-none">
                                    <i class="fab fa-pa"></i>
                                </div>
                            </div>
                            <div className="col-lg-9 col-sm-9 mb-lg-9">
                                <p>
                                    <p>Pay method: {'Payment in cash'}</p>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row order-products justify-content-between">
                    <div className="col-lg-12 fix-padding cart-scroll">
                        {cartOrder.cartOrderItems.length === 0 ? (
                            <Message variant="alert-info mt-5">No product is selected</Message>
                        ) : (
                            <>
                                {cartOrder.cartOrderItems.map((item, index) => (
                                    <div className="order-product row" key={index}>
                                        <div className="col-md-3 col-3" style={{ width: '20%' }}>
                                            <img
                                                className="col-md-3 col-3"
                                                src={item.variant.product.image}
                                                alt={item.variant.product.name}
                                            />
                                        </div>
                                        <div className="col-md-5 col-5 d-flex align-items-center">
                                            <Link to={`/product/${item.variant.product._id}`}>
                                                <h6>{item.variant.product.name}</h6>
                                            </Link>
                                        </div>
                                        <div className="mt-3 mt-md-0 col-md-1 col-1  d-flex align-items-center flex-column justify-content-center ">
                                            <h4>Size</h4>
                                            <h6>{item?.variant?.size}</h6>
                                        </div>
                                        <div className="mt-3 mt-md-0 col-md-1 col-1  d-flex align-items-center flex-column justify-content-center ">
                                            <h4>Color</h4>
                                            <h6>{item?.variant?.color}</h6>
                                        </div>
                                        <div className="mt-3 mt-md-0 col-md-1 col-1  d-flex align-items-center flex-column justify-content-center ">
                                            <h4>QUANTITY</h4>
                                            <h6>{item?.quantity}</h6>
                                        </div>
                                        <div className="mt-3 mt-md-0 col-md-1 col-1 align-items-end  d-flex flex-column justify-content-center ">
                                            <h4>SUBTOTAL</h4>
                                            <h6>${item?.quantity * item?.variant?.price}</h6>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
                <div className="row d-flex" style={{ padding: '10px 0', backgroundColor: '#fff', marginTop: '10px' }}>
                    {/* total */}
                    <div className="col-9 d-flex align-items-end flex-column subtotal-order">
                        <table className="table table-bordered fix-bottom">
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>Products</strong>
                                    </td>
                                    <td>${cartOrder.itemsPrice}</td>
                                    <td>
                                        <strong>Tax</strong>
                                    </td>
                                    <td>${cartOrder.taxPrice}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Shipping</strong>
                                    </td>
                                    <td>${cartOrder.shippingPrice}</td>

                                    <td>
                                        <strong>Total</strong>
                                    </td>
                                    <td>${cartOrder.totalPrice}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="col-3 d-flex justify-content-center align-content-center flex-column ">
                        <div style={{ fontWeight: '600', height: '50%', textAlign: 'center', lineHeight: '2.5rem' }}>
                            Total: ${cartOrder.totalPrice}
                        </div>
                        {cartOrder.cartOrderItems.length === 0 ? null : (
                            <WrapConfirmModal content={createContent()} handleSubmit={placeOrderHandler}>
                                <button
                                    type="submit"
                                    class="btn btn-primary pay-button col-12"
                                    style={{ height: '100%' }}
                                >
                                    PLACE ORDER
                                </button>
                            </WrapConfirmModal>
                        )}
                    </div>
                </div>
                {/* <div
                    className="row"
                    style={{ padding: '10px 0', backgroundColor: '#fff', marginTop: '10px', marginBottom: '30px' }}
                >
                    {error && (
                        <div className="">
                            <Message variant="alert-danger">{error}</Message>
                        </div>
                    )}
                </div> */}
            </div>
        </>
    );
};

export default PlaceOrderScreen;
