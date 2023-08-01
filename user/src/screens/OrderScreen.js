import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './../components/Header';
import { PayPalButton } from 'react-paypal-button-v2';
import { useDispatch, useSelector } from 'react-redux';
import { cancelOrder, confirmPaid, getOrderDetails, payOrder } from '../Redux/Actions/OrderActions';
import Loading from './../components/LoadingError/Loading';
import Message from './../components/LoadingError/Error';
import moment from 'moment';
import axios from 'axios';
import { ORDER_PAY_RESET } from '../Redux/Constants/OrderConstants';
import image, { imageOrder } from '~/assets/images';
import { Dialog } from 'primereact/dialog';
import { Button } from 'react-bootstrap';
import { ReviewDialog } from '~/components/profileComponents/Review/ReviewDialog';
import Toast from '~/components/LoadingError/Toast';

const OrderScreen = ({ match }) => {
    window.scrollTo(0, 0);
    const [sdkReady, setSdkReady] = useState(false);
    const orderId = match.params.id;
    const dispatch = useDispatch();

    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails;
    const orderPay = useSelector((state) => state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay;

    const orderCancel = useSelector((state) => state.orderCancel);
    const { loading: loadingCancel, success: successCancel } = orderCancel;

    const orderConfirmPaid = useSelector((state) => state.orderConfirmPaid);
    const { loading: loadingConfirmPaid, success: successConfirmPaid } = orderConfirmPaid;

    const itemsPrice = order?.orderItems.reduce((totalPrice, i) => totalPrice + i.quantity * i?.price, 0).toFixed(2);

    const cancelOrderHandler = () => {
        if (window.confirm('Are you sure??')) {
            dispatch(cancelOrder({ orderId: order?._id }));
        }
    };
    const handlePaid = () => {
        if (window.confirm('Are you sure??')) {
            dispatch(confirmPaid({ orderId: order?._id }));
        }
    };
    //gọi thêm userLogin để lấy số điện thoại
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    if (!loading) {
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2);
        };

        order.itemsPrice = addDecimals(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0));
    }

    const footer = (
        <div>
            <Button label="Yes" icon="pi pi-check" />
            <Button label="No" icon="pi pi-times" />
        </div>
    );

    const myIcon = (
        <button className="p-dialog-titlebar-icon p-link">
            <span className="pi pi-search"></span>
        </button>
    );

    useEffect(() => {
        dispatch(getOrderDetails(orderId));
    }, [successCancel, successConfirmPaid]);
    useEffect(() => {
        // const addPayPalScript = async () => {
        //   const { data: clientId } = await request.get("/api/config/paypal");
        //   const script = document.createElement("script");
        //   script.type = "text/javascript";
        //   script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
        //   script.async = true;
        //   script.onload = () => {
        //     setSdkReady(true);
        //   };
        //   document.body.appendChild(script);
        // };
        if (!order || successPay) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch(getOrderDetails(orderId));
        }
        // else if (!order.isPaid) {
        // if (!window.paypal) {
        //   addPayPalScript();
        // } else {
        //   setSdkReady(true);
        // }
        // }
    }, [dispatch, orderId, order]);
    //[dispatch, orderId, successPay, order]);
    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult));
    };

    return (
        <>
            <Toast />
            <Header />
            <div className="container">
                {loading ? (
                    <Loading />
                ) : error ? (
                    <Message variant="alert-danger">{error}</Message>
                ) : (
                    <>
                        <div className="content-header"></div>
                        {/* <div className="row order-detail d-flex">
                            {['Placed', 'Approved', 'Delivering', 'Paid', 'Completed', 'Failed', 'Cancelled'].map(
                                (item, i) => (
                                    <div className="d-flex">
                                        <div className="order-border">
                                            <div className={`order-${item}`}></div>
                                        </div>
                                        <div>{i < 6 && <i class="far fa-arrow-right"></i>}</div>
                                    </div>
                                ),
                            )}
                        </div> */}
                        <div
                            className="row shadow-sm d-flex justify-content-center align-content-center "
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100wh',
                                justifyItems: 'center',
                                position: 'relative',
                                backgroundColor: '#fff',
                            }}
                        >
                            <span
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                }}
                            >
                                HISTORY STATUS
                            </span>
                            <ul
                                className="d-flex align-content-between d-flex justify-content-center "
                                style={{ padding: '15px' }}
                            >
                                {order.statusHistory.map((status, i) => (
                                    <li className="d-flex" style={{ position: 'relative', justifyItems: 'center' }}>
                                        <div
                                            className=""
                                            style={{
                                                padding: '15PX 60px',
                                                display: 'flex',
                                                justifyItems: 'center',
                                                height: '5rem',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <img
                                                style={{
                                                    height: '100%',
                                                    zIndex: '2',
                                                }}
                                                src={imageOrder[`${status.status}`]}
                                            />
                                            <div style={{ marginTop: '15px', fontSize: '1.2rem' }}>{status.status}</div>
                                        </div>
                                        {i < order.statusHistory.length - 1 && (
                                            <div className="order-status-history-line"></div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="row  order-detail shadow-sm">
                            <div className="d-flex justify-content-between " style={{ padding: '20px 24px 0px' }}>
                                <h5
                                    className="row d-block"
                                    style={{
                                        borderBottom: '1px solid rgba(0, 0, 0, 0.09)',
                                    }}
                                >
                                    DELIVERY ADDRESS
                                </h5>
                                <h6
                                    className="row d-block"
                                    style={{
                                        // marginBottom: '25px',
                                        borderBottom: '1px solid rgba(0, 0, 0, 0.09)',
                                    }}
                                >
                                    {`Order id: ${order._id} `}
                                </h6>
                            </div>
                            <div
                                className="d-flex align-content-between"
                                style={{
                                    margin: '2rem',
                                    width: '6rem',
                                }}
                            >
                                <img
                                    src={image.orderUser}
                                    alt="userprofileimage"
                                    style={{ height: '6rem', width: '65rem' }}
                                    className="fix-none"
                                />
                            </div>

                            <div
                                className="col-lg-3 col-sm-3 mb-lg-3 mb-3 mb-sm-3 fix-bottom p-3  "
                                style={{ margin: '0px 15px 0px 15px' }}
                            >
                                <p className="order-name-customer ">{order?.username}</p>
                                <p className="order-address-custommer">{order?.contactInformation?.phone}</p>
                                <p className="order-address-custommer">{order?.user?.name}</p>

                                <p className="order-address-custommer">
                                    {' '}
                                    {`${order?.shippingAddress?.address}, ${order?.shippingAddress?.city}, ${order?.shippingAddress?.country}`}
                                </p>
                            </div>
                            <div className="col-lg-5 col-sm-5 mb-lg-5 mb-5 mb-sm-5 d-flex align-content-lg-start">
                                <ul className="order-history-status-ul" style={{ minHeight: '130px' }}>
                                    {order.statusHistory?.reverse()?.map((item) => (
                                        <li className="d-flex order-history-status-li ">
                                            <div style={{ paddingRight: '15px' }}> o</div>
                                            <div className={``}>{`${item.status} ${moment(
                                                item.updatedAt,
                                            ).calendar()}`}</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* <div className={`order-${order.status}`}></div> */}
                            <div
                                className="col-2"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    height: '5rem',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <img
                                    style={{
                                        height: '100%',
                                    }}
                                    src={imageOrder[`${order.status}`]}
                                />
                                <div style={{ marginTop: '15px', fontSize: '1.2rem' }}>{order.status}</div>
                            </div>

                            {/* 2 */}
                        </div>
                        <div
                            className="row order-products justify-content-between"
                            style={{ marginBottom: '30px', backgroundColor: '#fff', padding: '0.8rem' }}
                        >
                            <div className="col-lg-8 fix-padding cart-scroll">
                                {order.orderItems.length === 0 ? (
                                    <Message variant="alert-info mt-5">Your order is empty</Message>
                                ) : (
                                    <>
                                        {order.orderItems.map((item, index) => (
                                            <div className="order-product row shadow-sm" key={index}>
                                                <div className="col-md-2 col-2">
                                                    <img src={item?.image} alt={item?.name} />
                                                </div>
                                                <div className="col-md-5 col-3 d-flex align-items-center">
                                                    <Link to={`/product/${item?.product}`}>
                                                        <h6>{item?.name}</h6>
                                                    </Link>
                                                </div>
                                                <div className="mt-1 mt-md-1 col-md-1 col-1  d-flex align-items-center flex-column justify-content-center ">
                                                    <h4>QUANTITY</h4>
                                                    <h6>{item?.quantity}</h6>
                                                </div>
                                                <div className="mt-1 mt-md-1 col-md-1 col-1  d-flex align-items-center flex-column justify-content-center ">
                                                    <h4>SIZE</h4>
                                                    <h6>{item?.size}</h6>
                                                </div>
                                                <div className="mt-1 mt-md-1 col-md-1 col-1  d-flex align-items-center flex-column justify-content-center ">
                                                    <h4>COLOR</h4>
                                                    <h6>{item?.color}</h6>
                                                </div>
                                                <div className="mt-2 mt-md-2 col-md-2 col-2 align-items-end  d-flex flex-column justify-content-center ">
                                                    <h4>SUBTOTAL</h4>
                                                    <h6>${item?.quantity * item?.price}</h6>
                                                </div>
                                                {order.status === 'Completed' && order?.orderItems?.length >= 1 && (
                                                    <div
                                                        className="d-flex justify-content-end col-12"
                                                        style={{ marginTop: '10px' }}
                                                    >
                                                        <ReviewDialog order={item} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                            {/* total */}
                            <div
                                className="col-4"
                                style={{
                                    borderLeft: '1px solid rgba(0, 0, 0, .09)',
                                    backgroundColor: '#fff',
                                    paddingLeft: '15px',
                                }}
                            >
                                <table
                                    className="table table-bordered"
                                    style={{
                                        backgroundColor: '#fff',
                                    }}
                                >
                                    <tbody>
                                        <tr>
                                            <td>
                                                <strong>Products</strong>
                                            </td>
                                            <td>${itemsPrice}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Shipping</strong>
                                            </td>
                                            <td>${order.shippingPrice}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Tax</strong>
                                            </td>
                                            <td>${order.taxPrice}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Total</strong>
                                            </td>
                                            <td>${order.totalPrice}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                {order.status === 'Placed' && (
                                    <div className="col-lg-12 " style={{ paddingTop: '10px' }}>
                                        <button
                                            disabled={order.status === 'Cancelled'}
                                            onClick={cancelOrderHandler}
                                            className="btn btn-dark col-12"
                                            style={{ marginBottom: '-10px' }}
                                        >
                                            CANCEL THIS ORDER
                                        </button>
                                    </div>
                                )}
                                {order.status === 'Delivering' && (
                                    <div className="col-lg-12 " style={{ paddingTop: '10px' }}>
                                        <button
                                            disabled={order.status === 'Cancelled'}
                                            onClick={handlePaid}
                                            className="btn btn-danger col-12"
                                            style={{ marginBottom: '-10px' }}
                                        >
                                            Paid Confirmation
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default OrderScreen;
