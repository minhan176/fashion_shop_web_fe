import React from 'react';
import Sidebar from './../components/sidebar';
import Header from './../components/Header';
import OrderMain from '../components/orders/OrderMain';

const OrderScreen = ({ match }) => {
  const dateOrder = match.params.dateOrder;
  const pageNumber = match.params.pageNumber;
  const orderStatus = match.params.orderStatus;
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <OrderMain dateOrder={dateOrder} pageNumber={pageNumber} orderStatus={orderStatus} />
      </main>
    </>
  );
};

export default OrderScreen;
