import React, { useEffect, useState, useRef, useCallback } from 'react';
import Header from './../components/Header';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addProductOrderInCart, listCart, removefromcart, updateCart } from './../Redux/Actions/cartActions';

import WrapConfirmModal from '~/components/Modal/WrapConfirmModal';
import Toast from '~/components/LoadingError/Toast';
import Loading, { FormLoading } from '~/components/LoadingError/Loading';

const CartScreen = ({ match, location, history }) => {
    const logger = (key) => {
        return {
            log(info) {
                return console[key](info);
            },
        };
    };
    const log = logger('log');

    window.scrollTo(0, 0);
    const dispatch = useDispatch();
    const productId = match.params.id;
    const qty = location.search ? Number(location.search.split('=')[1]) : 1;

    const cart = useSelector((state) => state.cart);
    const { cartItems, loading: loadListCart } = cart;
    const [cartChoise, setCartChoise] = useState({});

    const [loadingIndices, setLoadingIndices] = useState(null);
    const cartDel = useSelector((state) => state.cartDelete);
    const { loading: loa, success: suc, mesage: mes } = cartDel;
    const cartCreate = useSelector((state) => state.cartCreate);
    const { loading: loadingCreate, success: successCreate } = cartCreate;

    const cartUpdate = useSelector((state) => state.cartUpdate);
    const { loading: loadingUpdate, success: successUpdate, error: errorUpdate } = cartUpdate;
    const refItem = useRef();

    const total = cartChoise
        ? Object.values(cartChoise)
              .reduce((a, i) => a + i.quantity * i.variant?.price, 0)
              .toFixed(2)
        : 0;
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const checkOutHandler = () => {
        dispatch(addProductOrderInCart(Object.values(cartChoise)));
        history.push('/login?redirect=shipping');
    };

    const removeFromCartHandle = (id) => {
        if (window.confirm('Are you sure!')) {
            dispatch(removefromcart({ id, setCartChoise, deleteCartOnly: true }));
        }
    };
    const handleDeleteAll = useCallback(() => {
        dispatch(removefromcart({ id: Object.keys(cartChoise), setCartChoise, deleteCartAll: true }));
    }, [cartChoise]);

    const createContent = useCallback(() => {
        return { title: 'Remove product in cart', body: 'Are you sure' };
    });

    useEffect(() => {
        dispatch(listCart());
        if (successUpdate)
            setTimeout(() => {
                if (successUpdate && loadingIndices !== null) {
                    setLoadingIndices(null);
                }
            }, 320);
    }, [suc, successCreate, successUpdate]);

    return (
        <>
            <Toast />
            <Header />

            {/* Cart */}

            {/* </div> */}
            <div className="container ">
                {/* {<FormLoading />} */}
                {loadListCart && <FormLoading />}
                {cartItems?.length === 0 || !cartItems ? (
                    <div className=" alert alert-info text-center mt-3 position-relative">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <img
                                style={{ width: '100px', height: '100px', margin: '0 auto' }}
                                src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/cart/9bdd8040b334d31946f49e36beaf32db.png"
                            ></img>
                            Your shopping cart is empty
                        </div>
                        <Link
                            className="btn btn-success mx-5 px-5 py-3"
                            to="/"
                            style={{
                                fontSize: '12px',
                            }}
                        >
                            SHOPPING NOW
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="backTo" style={{ paddingTop: '10px' }}>
                            <Link to="/" className="col-md-6 ">
                                <i class="fas fa-undo" style={{ paddingRight: '5px' }}></i>
                                Back To Shop
                            </Link>
                        </div>
                        <div className=" alert alert-info text-center mt-3">
                            Total Cart Products
                            <Link className="text-success mx-2" to="/cart">
                                ({cartItems?.length ?? 0})
                            </Link>
                        </div>
                        {/* cartiterm */}

                        <div className="cart-scroll">
                            {cartItems?.map((item, index) => (
                                <div className="cart-iterm row" ref={refItem}>
                                    {item?.quantity > 0 ? (
                                        <div
                                            className="col-md-1 cart-check
                                        "
                                            style={{ height: '100%' }}
                                        >
                                            <input
                                                style={{ height: '100%' }}
                                                type="checkbox"
                                                checked={cartChoise[item?.variant?._id] != undefined}
                                                onChange={(e) => {
                                                    setCartChoise((pre) => {
                                                        if (pre[item?.variant?._id] === undefined)
                                                            pre[item?.variant?._id] = item;
                                                        else delete pre[item?.variant?._id];
                                                        return { ...pre };
                                                    });
                                                    refItem.current.focus();
                                                }}
                                            ></input>
                                        </div>
                                    ) : (
                                        <div className="col-md-1 cart-check">
                                            <span className="span" style={{ fontSize: '12px', color: 'red' }}>
                                                Unavailable
                                            </span>
                                        </div>
                                    )}
                                    <div className="cart-image col-md-2">
                                        <img src={item?.variant?.product?.image} alt={item.product?.name} />
                                    </div>
                                    <div className="cart-text col-md-4 d-flex align-items-center">
                                        <Link to={`/product/${item?.variant?.product?._id}`}>
                                            <h4>{item?.variant?.product?.name}</h4>
                                        </Link>
                                    </div>
                                    <div className="cart-image col-md-1 d-flex flex-column justify-content-center">
                                        <h6>SIZE</h6>
                                        <span>{item?.variant?.size}</span>
                                    </div>
                                    <div className="cart-image col-md-1 d-flex flex-column justify-content-center">
                                        <h6>COLOR</h6>
                                        <span>{item?.variant?.color}</span>
                                    </div>

                                    <div
                                        className="cart-qty col-md-1 col-sm-5 mt-3 mt-md-0 d-flex flex-column justify-content-center quantity-css"
                                        style={{ position: 'relative' }}
                                    >
                                        <h6>QUANTITY</h6>
                                        <select
                                            className="form-select select-quantity"
                                            disabled={
                                                item?.variant?.quantity <= 0 ||
                                                // loadingCreate === true ||
                                                loadingIndices === index
                                            }
                                            value={item.quantity}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                setLoadingIndices(index);
                                                dispatch(
                                                    updateCart({
                                                        variantId: item?.variant?._id,
                                                        qty: e.target.value,
                                                        setCartChoise,
                                                        setLoadingIndices,
                                                        updateCart: true,
                                                    }),
                                                );
                                            }}
                                        >
                                            {[...Array(item?.variant?.quantity).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="cart-price mt-3 mt-md-0 col-md-1 align-items-sm-end align-items-start  d-flex flex-column justify-content-center col-sm-7 quantity-css">
                                        <h6>PRICE</h6>
                                        <h4>${item?.variant?.price}</h4>
                                    </div>

                                    <div
                                        className=" col-md-1 delete-cart"
                                        onClick={() => {
                                            removeFromCartHandle([item.variant._id]);
                                        }}
                                        style={{ display: 'flex', justifyContent: 'right', cursor: 'pointer' }}
                                    >
                                        Remove
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* End of cart iterms */}
                        <hr />
                        <div className="cart-buttons d-flex align-items-center row">
                            <div className="total col-md-3">
                                <span className="">{`Total (${Object.keys(cartChoise).length || 0}):  `}</span>
                                <span className="total-price">{` ${total} `}</span>
                            </div>

                            <div className="total col-md-3">
                                {Object.keys(cartChoise).length > 0 && (
                                    <WrapConfirmModal content={createContent()} handleSubmit={handleDeleteAll}>
                                        <span>Remove</span>
                                    </WrapConfirmModal>
                                )}
                            </div>
                            {total > 0 && (
                                <div className="col-md-6 d-flex justify-content-md-end mt-3 mt-md-0">
                                    <button
                                        data-bs-toggle="modal"
                                        // data-bs-target="#staticBackdrop"
                                        onClick={checkOutHandler}
                                    >
                                        Checkout
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default CartScreen;
