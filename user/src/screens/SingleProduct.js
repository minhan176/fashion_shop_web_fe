import React, { useEffect, useState } from 'react';
import Header from './../components/Header';
import Rating from '../components/homeComponents/Rating';
import { Link } from 'react-router-dom';
import Message from './../components/LoadingError/Error';
import { useDispatch, useSelector } from 'react-redux';
import { createProductReview, listProductDetails } from '../Redux/Actions/ProductActions';
import Loading from '../components/LoadingError/Loading';
import { PRODUCT_CREATE_REVIEW_RESET } from '../Redux/Constants/ProductConstants';
import moment from 'moment';
import { addProductOrderInCart, addToCart } from '../Redux/Actions/cartActions';
import image from '~/assets/images';
import Toast from '~/components/LoadingError/Toast';
import useDebounce from '~/hooks/useDebounce';

const SingleProduct = ({ history, match }) => {
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [currentColor, setCurrentColor] = useState(0);
    const [currentSize, setCurrentSize] = useState('');

    const productId = match.params.id;
    const dispatch = useDispatch();

    const deBounce = useDebounce(qty, 500);
    const [currentQty, setCurrentQty] = useState(1);
    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const productReviewCreate = useSelector((state) => state.productReviewCreate);
    const {
        loading: loadingCreateReview,
        error: errorCreateReview,
        success: successCreateReview,
    } = productReviewCreate;
    const defaultColor =
        product.variants?.reduce((color, value) => {
            if (!color.includes(value.color)) color.push(value.color);
            return color;
        }, []) || [];

    const defaultSize =
        product.variants?.reduce((sizes, value) => {
            if (!sizes.includes(value.size)) sizes.push(value.size);
            return sizes;
        }, []) || [];

    // const defaultVariants = defaultSize?.map((value, index) =>
    //     product.variants.reduce(
    //         (variants, variant, i) => {
    //             if (variant.size === value) variants = { field: [...variants.field, variant] };
    //             return variants;
    //         },
    //         { field: [] },
    //     ),
    // );

    useEffect(() => {
        if (!qty) setQty(null);
        if (qty > quantity) setQty(quantity);
        else if (qty <= 0) setQty(1);
    }, [deBounce]);

    const quantity = product?.variants?.find(
        (value) => value.color == currentColor && value.size == currentSize,
    )?.quantity;
    useEffect(() => {
        if (successCreateReview) {
            // alert('Review Submitted');
            setRating(0);
            setComment('');
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
        }
        dispatch(listProductDetails(productId));
    }, [dispatch, productId, successCreateReview]);

    const AddToCartHandle = (e) => {
        e.preventDefault();

        const variantId = product?.variants?.find(
            (value) => value.color == currentColor && value.size == currentSize,
        )._id;

        if (userInfo && variantId) {
            dispatch(addToCart(variantId, qty, history));
        } else history.push('/login');
    };

    const BuyProductHandle = (e) => {
        e.preventDefault();
        const variantOrder = product?.variants?.find(
            (value) => value.color == currentColor && value.size == currentSize,
        );
        if (userInfo && variantOrder) {
            dispatch(
                addProductOrderInCart([
                    {
                        quantity: qty,
                        variant: {
                            ...variantOrder,
                            product: { ...product, variants: product?.variants?.map((value) => value._id) },
                        },
                    },
                ]),
            );
            history.push('/login?redirect=shipping');
        } else history.push('/login');
    };
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(
            createProductReview({
                productId,
                review: {
                    rating,
                    comment,
                },
            }),
        );
    };
    return (
        <>
            <Toast />
            <Header />
            <div className="container single-product">
                {loading ? (
                    <Loading />
                ) : error ? (
                    <Message variant="alert-danger">{error}</Message>
                ) : (
                    <>
                        <div className="row">
                            <div className="col-md-12 product-avatar">
                                <div className="row">
                                    <div className="col-md-5">
                                        <div className="single-image">
                                            <img src={product.image} alt={product.name} />
                                        </div>
                                    </div>
                                    <div className="col-md-7 product-postion">
                                        <div className="product-dtl">
                                            <div className="product-info">
                                                <div className="product-name">{product.name}</div>
                                            </div>
                                            {/* <p>{product.description}</p> */}

                                            <div className="product-baner">
                                                <img
                                                    style={{ width: '100%' }}
                                                    src={image.imgInSigleProduct}
                                                    alt=""
                                                ></img>
                                            </div>
                                            <div className="product-count col-lg-12 ">
                                                <div className="flex-box d-flex justify-content-start align-items-center">
                                                    <h4 className="col-3">Price</h4>
                                                    <div>
                                                        <span>
                                                            $
                                                            {product?.variants
                                                                ?.find(
                                                                    (value) =>
                                                                        value.color == currentColor &&
                                                                        value.size == currentSize,
                                                                )
                                                                ?.price.toFixed(2) || product.price}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex-box d-flex justify-content-start align-items-center">
                                                    <h6 className="col-3">Status</h6>
                                                    {product?.variants?.find(
                                                        (value) =>
                                                            value.color == currentColor && value.size == currentSize,
                                                    )?.quantity ||
                                                    product?.variants?.reduce(
                                                        (count, value, index) => count + value.quantity,
                                                        0,
                                                    ) ? (
                                                        <span>In Stock</span>
                                                    ) : (
                                                        <span>unavailable</span>
                                                    )}
                                                </div>
                                                <div className="flex-box d-flex justify-content-start align-items-center flex-wrap">
                                                    <h6 className="col-3">Reviews</h6>
                                                    <Rating
                                                        value={product.rating}
                                                        text={`${product.numReviews} reviews`}
                                                    />
                                                </div>
                                                <div className="flex-box d-flex justify-content-start align-items-center flex-wrap">
                                                    <h6 className="col-3">Size</h6>
                                                    <div className="col-9">
                                                        {defaultSize?.map((value, index) => (
                                                            <button
                                                                onClick={() => {
                                                                    setCurrentSize(value);
                                                                }}
                                                                className={`btn text-md-start btn__product-option ${
                                                                    value === currentSize && 'active'
                                                                }`}
                                                            >
                                                                {value}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex-box d-flex justify-content-start align-items-center flex-wrap">
                                                    <h6 className="col-3">Color</h6>
                                                    {defaultColor?.map((value, index) => (
                                                        <button
                                                            onClick={() => {
                                                                setCurrentColor(value);
                                                            }}
                                                            className={`btn text-md-start btn__product-option ${
                                                                value == currentColor && 'active'
                                                            }`}
                                                        >
                                                            {value}
                                                        </button>
                                                    ))}
                                                </div>

                                                {product?.variants?.find(
                                                    (value) => value.color == currentColor && value.size == currentSize,
                                                )?.quantity ? (
                                                    <>
                                                        <div className="flex-box d-flex justify-content-start align-items-center">
                                                            <h6 className="col-3">Quantity</h6>

                                                            <div className="col-9 d-flex align-items-center">
                                                                <i
                                                                    class="far fa-minus input-quantity icon"
                                                                    onClick={() => {
                                                                        if (qty >= 2) setQty((qty) => qty - 1);
                                                                    }}
                                                                ></i>
                                                                <input
                                                                    class="input-quantity remove-arrow-input"
                                                                    type="number"
                                                                    // role="spinbutton"
                                                                    // aria-valuemax={quantity}
                                                                    value={parseInt(qty)}
                                                                    onKeyDown={(evt) =>
                                                                        [('e', 'E', '+', '-')].includes(evt.key) &&
                                                                        evt.target.startWith(0) &&
                                                                        evt.preventDefault()
                                                                    }
                                                                    onChange={(e) => {
                                                                        setQty(parseInt(e.target.value));
                                                                    }}
                                                                ></input>
                                                                <i
                                                                    class="far fa-plus input-quantity icon"
                                                                    style={{ marginRight: '15px' }}
                                                                    onClick={() => {
                                                                        if (qty < quantity) setQty((qty) => qty + 1);
                                                                    }}
                                                                ></i>
                                                                {product?.variants?.find(
                                                                    (value) =>
                                                                        value.color == currentColor &&
                                                                        value.size == currentSize,
                                                                )?.quantity ||
                                                                    product?.variants?.reduce(
                                                                        (count, value, index) => count + value.quantity,
                                                                        0,
                                                                    )}{' '}
                                                                products available
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="d-flex"
                                                            style={{ marginTop: '10px', marginLeft: '25px' }}
                                                        >
                                                            <button
                                                                onClick={AddToCartHandle}
                                                                style={{ marginRight: '15px' }}
                                                                className="col-4 btn btn-outline-danger"
                                                            >
                                                                Add To Cart
                                                            </button>
                                                            <button
                                                                onClick={BuyProductHandle}
                                                                className="col-2 btn btn-primary"
                                                            >
                                                                Buy product
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="product-description">
                                <h2>Description</h2>
                                <p>{product.description}</p>
                            </div>
                            {/* RATING */}
                            <div className="col-md-12 product-rating" style={{ paddingTop: '20px' }}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="mb-3">REVIEWS</h6>
                                        <div className="rating-review">
                                            {product.reviews.length === 0 && (
                                                <Message variant={'alert-info mt-3'}>No Reviews</Message>
                                            )}
                                            {product.reviews.map((review) => (
                                                <div
                                                    key={review._id}
                                                    className="mb-5 mb-md-3 bg-light p-3 shadow-sm rounded"
                                                >
                                                    <div style={{ display: 'flex' }}>
                                                        <div className="rating-review__flex">
                                                            <p>{review.name.slice(0, 1)}</p>
                                                        </div>
                                                        <div style={{ paddingLeft: '10px' }}>
                                                            <div
                                                                className="review-rating"
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    lineHeight: '0.1',
                                                                }}
                                                            >
                                                                <strong>{review.name}</strong>
                                                                <Rating value={review.rating} />
                                                            </div>
                                                            <span>{moment(review.createdAt).calendar()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="alert alert-info mt-3">{review.comment}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div style={{ paddingLeft: '10px' }}>
                                            <h6 className="write-review">WRITE A CUSTOMER REVIEW</h6>
                                            <div className="my-4">
                                                {loadingCreateReview && <Loading />}
                                                {/* {errorCreateReview && (
                                                    <Message variant="alert-danger">{errorCreateReview}</Message>
                                                )} */}
                                            </div>
                                            {userInfo ? (
                                                <form onSubmit={submitHandler}>
                                                    <div className="my-4">
                                                        <strong>Rating</strong>
                                                        <select
                                                            value={rating}
                                                            onChange={(e) => setRating(e.target.value)}
                                                            className="col-12 bg-light p-3 mt-2 border-0 rounded"
                                                        >
                                                            <option value="">Select...</option>
                                                            <option value="1">1 - Poor</option>
                                                            <option value="2">2 - Fair</option>
                                                            <option value="3">3 - Good</option>
                                                            <option value="4">4 - Very Good</option>
                                                            <option value="5">5 - Excellent</option>
                                                        </select>
                                                    </div>
                                                    <div className="my-4">
                                                        <strong>Comment</strong>
                                                        <textarea
                                                            row="3"
                                                            value={comment}
                                                            onChange={(e) => setComment(e.target.value)}
                                                            className="col-12 bg-light p-3 mt-2 border-0 rounded"
                                                        ></textarea>
                                                    </div>
                                                    <div className="my-3">
                                                        <button
                                                            disabled={loadingCreateReview}
                                                            className="col-12 bg-orange border-0 p-3 rounded text-white"
                                                        >
                                                            SUBMIT
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="my-3">
                                                    <Message variant={'alert-warning'}>
                                                        Please{' '}
                                                        <Link to="/login">
                                                            " <strong>Login</strong> "
                                                        </Link>{' '}
                                                        and buy this product to write a review{' '}
                                                    </Message>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default SingleProduct;
