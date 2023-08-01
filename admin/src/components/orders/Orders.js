import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { statusDescription } from './statusDescription';
import Pagination from '../Home/pagination';
const Orders = (props) => {
  const { orders } = props;
  let orderss = orders.orders;
  const [dateOrder, setDateOrder] = useState('');
  const [orderStatus, setOrderStatus] = useState('');

  // const [page, setPage] = useState('1');
  // const [, setStatus] = useState('0');
  // const [status, setStatus] = useState('0');

  // const handleStatus = (value) => {
  //   setStatus(value.target.value);
  // };

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Total</th>
            <th scope="col">Date</th>
            <th>Status</th>
            <th scope="col" className="text-end">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {orders?.orders?.length === 0 && <tr className="">No order</tr>}
          {orders?.orders?.map((order) => (
            <tr key={order._id}>
              <td>
                <b>{order?.username}</b>
              </td>
              <td>{order?.contactInformation?.email || order?.user?.email}</td>
              <td>${order?.totalPrice}</td>
              <td>{moment(order.createdAt).format('MMM Do YY')}</td>
              <td style={{ position: 'relative' }}>
                {order?.status === 'Placed' && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '7px',
                      top: '2px',
                      borderRadius: '50%',
                      fontSize: '0.6rem',
                      display: 'block',
                      backgroundColor: 'red',
                      color: 'white',
                      height: '1.2rem',
                      width: '1.2rem',
                      lineHeight: '1.15rem',
                    }}
                  >
                    new
                  </div>
                )}
                <span
                  className={`badge rounded-pill 
                     ${order?.status === 'Completed' && 'alert-success'}
                      ${order?.status === 'Cancelled' && 'bg-dark text-white'}
                       ${order?.status === 'Failed' && 'bg-danger text-white'}
                      text-dark`}
                  style={{ fontSize: '15px' }}
                >
                  {statusDescription[order.status]}
                </span>
              </td>
              <td className="d-flex justify-content-end align-item-center">
                <Link to={`/order/${order._id}`} className="text-success">
                  <i className="fas fa-eye"></i>
                </Link>
              </td>
            </tr>
          ))}

          {/* Not paid Not delivered */}
          {/* <tr>
          <td>
            <b>Velcro Sneakers For Boys & Girls (Blue)</b>
          </td>
          <td>user@example.com</td>
          <td>$45,789</td>
          <td>
            <span className="badge rounded-pill alert-danger">Not paid</span>
          </td>
          <td>Dec 12 2021</td>
          <td>
            <span className="badge btn-dark">Not Delivered</span>
          </td>
          <td className="d-flex justify-content-end align-item-center">
            <Link to={`/order`} className="text-success">
              <i className="fas fa-eye"></i>
            </Link>
          </td>
        </tr> */}
        </tbody>
      </table>
      {/* <Pagination pages={pages} page={page}  keyword={keyword ? keyword : ''} /> */}
    </>
  );
};

export default Orders;
