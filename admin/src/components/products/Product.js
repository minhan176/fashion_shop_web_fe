import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteProduct } from '../../Redux/Actions/ProductActions';
import Toast from '../LoadingError/Toast';

const Product = (props) => {
  const { product } = props;
  const dispatch = useDispatch();

  const deletehandler = (id) => {
    if (window.confirm('Are you sure??')) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <>
      <div className="col-md-3 col-sm-4 col-lg-3 mb-5 col-xl-2 fix-bottom">
        <Toast />
        <div className="card card-product-grid">
          <Link to={`/product/${product._id}/edit`} className="img-wrap">
            <img src={product.image} alt="Product" />
          </Link>
          <div className="info-wrap">
            <Link
              to={`/product/${product._id}/edit`}
              className="title text-truncate"
              style={{ color: 'black', padding: '5px 0' }}
            >
              {product.name}
            </Link>
            <div className="countInStock-price" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="price mb-2">Price: ${product.price.toFixed(2)}</div>
            </div>
            <div className="row">
              <div className="d-flex align-content-center justify-content-between">
                <Link
                  to={`/product/${product._id}/edit`}
                  className="btn  btn-outline-primary col-5 "
                  style={{ fontSize: '18px', fontWeight: '600' }}
                >
                  <i className="fas fa-pen"></i>
                </Link>

                <div
                  onClick={() => deletehandler(product._id)}
                  className="btn btn-outline-danger col-5 "
                  style={{ fontSize: '18px', fontWeight: '600' }}
                >
                  <i className="fas fa-trash-alt"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
