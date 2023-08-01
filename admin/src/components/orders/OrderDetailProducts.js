import React from 'react';
import { Link } from 'react-router-dom';
import { statusDescription } from './statusDescription';

const OrderDetailProducts = (props) => {
  const { order, loading } = props;
  const itemsPrice = order?.orderItems.reduce((totalPrice, i) => totalPrice + i.quantity * i?.price, 0).toFixed(2);
  if (!loading) {
    // Calculate Price
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item?.variant?.product?.price * item?.quantity, 0),
    );
  }

  return (
    <>
      <table className="table border table-lg">
        <thead>
          <tr>
            <th style={{ width: '40%' }}>Product</th>
            <th style={{ width: '20%' }}>Unit Price</th>
            <th style={{ width: '10%' }}>Size</th>
            <th style={{ width: '10%' }}>Color</th>
            <th style={{ width: '10%' }}>Quantity</th>
            <th style={{ width: '10%' }} className="text-end">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item, index) => (
            <tr key={index}>
              <td>
                <Link className="itemside" to="#">
                  <div className="left">
                    <img
                      src={item?.image}
                      alt={item?.name}
                      style={{ width: '40px', height: '40px' }}
                      className="img-xs"
                    />
                  </div>
                  <div className="info">{item?.name}</div>
                </Link>
              </td>
              <td>${item?.price} </td>
              <td>{item?.size} </td>
              <td>{item?.color} </td>
              <td>{item.quantity} </td>
              <td className="text-end"> ${item.quantity * item.price}</td>
            </tr>
          ))}

          <tr>
            <td colSpan="8">
              <article className="float-end">
                <dl className="dlist">
                  <dt className="text-muted">Status:</dt>
                  <dd>
                    <b
                      className={`badge rounded-pill alert-primary
                     ${order?.status === 'Completed' && 'alert-success'}
                      ${order?.status === 'Cancelled' && 'alert-dark'}
                      ${order?.status === 'Failed' && 'alert-danger'}
                      `}
                      style={{ fontSize: '15px' }}
                    >
                      {statusDescription[order.status]}
                    </b>
                  </dd>
                </dl>
              </article>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default OrderDetailProducts;
