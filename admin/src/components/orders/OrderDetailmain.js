import React, { useEffect, useState } from 'react';
import OrderDetailProducts from './OrderDetailProducts';
import OrderDetailInfo from './OrderDetailInfo';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cancelOrder, deliverOrder, getOrderDetails, updateStatusOrder } from '../../Redux/Actions/OrderActions';
import Loading from '../LoadingError/Loading';
import Message from '../LoadingError/Error';
import moment from 'moment';
import Toast from '../LoadingError/Toast';
import { statusAdminUpdate, statusDescription } from './statusDescription';

const OrderDetailmain = (props) => {
  const { orderId } = props;
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, error, order } = orderDetails;

  // const orderUser = useSelector((state) => state.orderPaid);
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDelivered, success: successDelivered } = orderDeliver;
  const orderUpdateStatus = useSelector((state) => state.orderUpdateStatus);
  const { loading: loadingPaid, success: successUpdateStatus } = orderUpdateStatus;
  const orderCancel = useSelector((state) => state.orderCancel);
  const { loading: loadingCancel, success: successCancel } = orderCancel;
  const [status, setStatus] = useState(order?.status);
  const itemsPrice = order?.orderItems.reduce((totalPrice, i) => totalPrice + i.quantity * i?.price, 0).toFixed(2);
  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId, successDelivered, successUpdateStatus, successCancel]);
  useEffect(() => {
    setStatus(order?.statatus);
  }, [order]);
  const deliverHandler = () => {
    if (window.confirm('Are you sure??')) {
      dispatch(deliverOrder(order));
    }
  };

  const cancelOrderHandler = () => {
    if (window.confirm('Are you sure??')) {
      dispatch(cancelOrder(order));
    }
  };
  const undoSatusHandler = (status) => {
    if (window.confirm('Are you sure??')) {
      dispatch(updateStatusOrder({ status, orderId: order._id }));
    }
  };

  const saveStatusHandler = () => {
    if (window.confirm('Are you sure??')) {
      dispatch(updateStatusOrder({ status, orderId: order._id }));
    }
  };

  return (
    <section className="content-main">
      {/* <Toast /> */}
      <div className="content-header">
        <Link to="/orders" className="btn btn-dark text-white">
          Back To Orders
        </Link>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant="alert-danger">{error}</Message>
      ) : (
        <div className="card">
          <header className="card-header p-3 Header-white">
            <div className="row align-items-center ">
              <div className="col-lg-6 col-md-6">
                <span>
                  <i className="far fa-calendar-alt mx-2"></i>
                  <b className="text-black">{moment(order.createdAt).format('llll')}</b>
                </span>
                <br />
                <small className="text-black mx-3 ">Order ID: {order._id}</small>
              </div>
              {(order?.status === 'Placed' || order?.status === 'Approved') && (
                <div className="col-lg-3 col-md-6 ms-auto d-flex justify-content-end align-items-center">
                  <button
                    onClick={cancelOrderHandler}
                    className="btn btn-dark col-12"
                    style={{ marginBottom: '15px' }}
                    disabled={order?.status === 'Cancelled'}
                  >
                    CANCEL THIS ORDER
                  </button>
                </div>
              )}
              <div className="col-lg-5 col-md-5 ms-auto d-flex justify-content-end align-items-end">
                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb">
                    {order?.statusHistory.map((item, i) => (
                      <>
                        <li class="breadcrumb-item">
                          {i === order?.statusHistory.length - 1 &&
                          item.status !== 'Placed' &&
                          item.status !== 'Cancelled' &&
                          item.status !== 'Completed' ? (
                            <div
                              data-toggle="tooltip"
                              data-placement="top"
                              title="UNDO"
                              className="d-flex align-content-center justify-center order-undo-status-btn"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                              }}
                              onClick={() => undoSatusHandler(item.status)}
                            >
                              <i class="far fa-arrow-alt-circle-left text-danger"></i>
                              <span className="text-danger">{item.status}</span>
                            </div>
                          ) : (
                            <span href="#">{item.status}</span>
                          )}
                        </li>
                      </>
                    ))}
                  </ol>
                </nav>
              </div>
            </div>
          </header>
          <div className="card-body">
            {/* Order info */}
            <OrderDetailInfo order={order} />

            <div className="row">
              <div className="col-lg-9">
                <div className="table-responsive">
                  <OrderDetailProducts order={order} loading={loading} />
                </div>
              </div>
              {/* Payment Info */}

              {
                <div className="col-lg-3">
                  <div className="shadow-sm bg-light">
                    <div className="col-lg-12 col-12 col-md-12">
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

                      {order?.status !== 'Cancelled' && order?.status !== 'Completed' && (
                        <div style={{ padding: '10px', borderTop: '1px solid rgba(0,0,0,0.1)' }} className="">
                          {/* {order?.statusHistory.map((item, i) => (
                            <>
                              <span>{item.status}</span>
                              {i < order?.statusHistory.length - 1 && <span> >> </span>}
                            </>
                          ))} */}
                          <select
                            className="form-select"
                            defaultValue={order.status}
                            value={status}
                            onChange={(e) => {
                              setStatus(e.target.value);
                            }}
                          >
                            {Object.keys(statusAdminUpdate)?.map((item) => (
                              <option
                                disabled={order?.statusHistory.find((status) => status.status === item)}
                                className={item === 'Update status' && 'bg-light'}
                                value={item}
                              >
                                {item}
                              </option>
                            ))}
                            {/* <option value={'Approved'}>Confirm</option>
                            <option value={'Delivering'}>Delivering</option>
                            <option value={'Paid'}>Paid</option>
                            <option value={'Completed'}>Completed</option>
                            <option value={'Failed'}>Failed</option> */}
                          </select>

                          <div style={{ marginTop: '15px' }}>
                            {status !== 'Update status' && order.status !== 'Cancelled' && (
                              <button onClick={saveStatusHandler} className="btn btn-danger col-12">
                                SAVE STATUS
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default OrderDetailmain;
