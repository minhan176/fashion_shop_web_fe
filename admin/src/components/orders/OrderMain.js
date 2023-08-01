import React, { useEffect, useState } from 'react';
import Message from '../LoadingError/Error';
import Loading from '../LoadingError/Loading';
import Orders from './Orders';
import { useSelector, useDispatch } from 'react-redux';
import { listOrders } from '../../Redux/Actions/OrderActions';
import { dateFilter, statusDescription, statusFilter } from './statusDescription';
import Pagination from '../Home/pagination';
import PageOrder from '../Home/PageOrder';

const OrderMain = (props) => {
  // const { pageNumber } = props;
  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;
  const dispatch = useDispatch();

  const [dateOrder, setDateOrder] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const handleOrderStatus = (e) => {
    setOrderStatus(e.target.value);
  };

  const handleDateOrder = (e) => {
    setDateOrder(e.target.value);
  };
  useEffect(() => {
    setPageNumber('1');
  }, [orderStatus, dateOrder]);
  useEffect(() => {
    dispatch(listOrders(dateOrder, orderStatus, pageNumber));
  }, [dispatch, orderStatus, dateOrder, pageNumber]);
  return (
    <section className="content-main">
      <div className="content-header">
        <h2 className="content-title">Orders</h2>
      </div>
      <div className="row d-flex justify-content-end">
        <div className="col-lg-2 col-6 col-md-3" style={{ marginBottom: '5px' }}>
          <select className="form-select" value={dateOrder} onChange={handleDateOrder}>
            {dateFilter?.map((item) => (
              <option value={item.status}>{item.description}</option>
            ))}
          </select>
        </div>
        <div className="col-lg-2 col-6 col-md-3" style={{ marginBottom: '5px' }}>
          <select className="form-select" value={orderStatus} onChange={handleOrderStatus}>
            {statusFilter?.map((item) => (
              <option value={item.status}>{item.description}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="card mb-4 shadow-sm">
        {/* <header className="card-header bg-white">
          <div className="row gx-3 py-3">
            <div className="col-lg-4 col-md-6 me-auto">
              <input
                type="text"
                placeholder="Search..."
                className="form-control p-2"
              />
            </div>
            <div className="col-lg-2 col-6 col-md-3">
              <select className="form-select">
                <option>Status</option>
                <option>Active</option>
                <option>Disabled</option>
                <option>Show all</option>
              </select>
            </div>
            <div className="col-lg-2 col-6 col-md-3">
              <select className="form-select">
                <option>Show 20</option>
                <option>Show 30</option>
                <option>Show 40</option>
              </select>
            </div>
          </div>
        </header> */}
        <div className="card-body">
          <div className="table-responsive">
            {loading ? (
              <Loading />
            ) : error ? (
              <Message variant="alert-danger">{error}</Message>
            ) : (
              <Orders orders={orders} />
            )}
          </div>
        </div>
      </div>
      {!loading && (
        <div className="col-12 d-flex justify-center" style={{ display: 'flex', justifyContent: 'center' }}>
          <nav aria-label="...">
            <ul class="pagination">
              {[...Array(orders?.pages).keys()].map((item) => (
                <li
                  class={`page-item ${item === orders?.page - 1 && 'active'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setPageNumber(item + 1);
                  }}
                >
                  <a class="page-link">{item + 1}</a>
                </li>
              ))}
              {/* <li class="page-item disabled">
            <a class="page-link" href="#" tabindex="-1">
              Previous
            </a>
          </li> */}
              {/* <li class="page-item">
            <a class="page-link" href="#">
              Next
            </a>
          </li> */}
            </ul>
          </nav>
        </div>
      )}
    </section>
  );
};

export default OrderMain;
