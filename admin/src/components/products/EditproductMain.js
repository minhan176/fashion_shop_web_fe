import React, { useState, useEffect } from 'react';
import Toast from './../LoadingError/Toast';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editProduct, updateProduct } from './../../Redux/Actions/ProductActions';
import { PRODUCT_UPDATE_RESET } from '../../Redux/Constants/ProductConstants';
import { toast } from 'react-toastify';
import Message from '../LoadingError/Error';
import Loading from '../LoadingError/Loading';
import { ListCategory } from '../../Redux/Actions/categoryActions';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { FileUploadDemo } from './UploadImage';
import { Image } from 'primereact/image';

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};
const EditProductMain = (props) => {
  const [changeForALL, setChangForAll] = useState(false);

  const { productId } = props;
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [newImage, setNewImage] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const dispatch = useDispatch();

  const productEdit = useSelector((state) => state.productEdit);
  const { loading, error, success: successGetProduct, product } = productEdit;
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

  const defaultVariants = defaultSize?.map((value, index) =>
    product.variants.reduce(
      (variants, variant, i) => {
        if (variant.size === value) variants = { field: [...variants.field, variant] };
        return variants;
      },
      { field: [] },
    ),
  );
  const defaultGroupProduct = {
    option: ['size', 'color'],
    size: defaultSize,

    color: defaultColor,

    variants: defaultVariants,
  };
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const {
    getValues,
    setValue,
    register,
    handleSubmit,
    watch,
    reset,
    unregister,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: defaultGroupProduct,
    shouldUseNativeValidation: true,
  });

  const productUpdate = useSelector((state) => state.productUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate;

  const lcategories = useSelector((state) => state.CategoryList);
  const { categories } = lcategories;
  useEffect(() => {
    dispatch(ListCategory());
    if (successUpdate) {
      dispatch(editProduct(productId));
      dispatch({ type: PRODUCT_UPDATE_RESET });
      // toast.success('Product Updated', ToastObjects);
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(editProduct(productId));
      } else {
        setName(product.name);
        setDescription(product.description);
        setCountInStock(product.countInStock);
        setCategory(product.category);
        setImage(product.image);
        setPrice(product.price);
      }
    }
  }, [product, dispatch, productId, successUpdate]);

  useEffect(() => {
    dispatch(editProduct(productId));
  }, [productId]);

  useEffect(() => {
    if (successGetProduct) {
      setValue('size', defaultSize);
      setValue('color', defaultColor);
      setValue('variants', defaultVariants);
      setColor(defaultColor);
      setSize(defaultSize);
    }
  }, [successGetProduct, product]);

  const submitHandler = (data, e) => {
    e.preventDefault();
    if (category != -1) {
      let newProduct = new FormData();
      newProduct.append('_id', productId);
      newProduct.append('name', name);
      newProduct.append('description', description);
      newProduct.append('category', category);
      newProduct.append(
        'variants',
        JSON.stringify(
          data.variants.reduce((variants, variant) => {
            variants = variants.concat(variant.field);
            return variants;
          }, []),
        ),
      );
      newImage ? newProduct.append('productImage', newImage) : newProduct.append('productImage', image);
      // dispatch(
      //   updateProduct({
      //     _id: productId,
      //     name,
      //     category,
      //     description,
      //     image,
      //     variants: data.variants.reduce((variants, variant) => {
      //       variants = variants.concat(variant.field);
      //       return variants;
      //     }, []),
      //   }),
      // );
      dispatch(updateProduct(newProduct));
    }
  };

  return (
    <>
      {/* <Toast /> */}
      <section className="content-main" style={{ maxWidth: '1200px' }}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="content-header">
            <Link to="/product" className="btn btn-danger text-white">
              Go to products
            </Link>
            <h2 className="content-title">Update Product</h2>
            <div>
              <button type="submit" className="btn btn-primary">
                Update now
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-xl-12 col-lg-12">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  {loadingUpdate && <Loading />}
                  {loading ? (
                    <Loading />
                  ) : error ? (
                    <></>
                  ) : (
                    <>
                      <div className="mb-4">
                        <label htmlFor="product_title" className="form-label">
                          Product title
                        </label>
                        <input
                          type="text"
                          placeholder="Type here"
                          className="form-control"
                          id="product_title"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="product_category" className="form-label">
                          Category
                        </label>
                        <select
                          type="text"
                          id="product_category"
                          className="form-select"
                          placeholder="Category"
                          required
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option value={-1} selected>
                            Please select category
                          </option>
                          {categories.map((cate, index) => (
                            <option key={index} value={cate._id}>
                              {cate.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Description</label>
                        <textarea
                          placeholder="Type here"
                          className="form-control"
                          rows="7"
                          required
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Old Images</label>

                        <Image src={image} template="Preview Content" alt="Image Text" preview width="40px" />

                        <FileUploadDemo setImage={(value) => setNewImage(value)} name={name} />
                      </div>

                      <div className="card mb-4 shadow-sm">
                        <div className="card-body">
                          <div className="mb-4">
                            <h3>Information sales</h3>
                          </div>

                          {getValues('option')?.map((valueOption, index) => {
                            //Tránh ko bị rerender 2 lần trong setState
                            let dem = 0;
                            let demDelete = 0;
                            return (
                              <>
                                <div className="mb-4 d-flex" key={uuidv4()}>
                                  <div className="col-3">{index == 0 ? 'Size' : 'Color'}</div>
                                  <div className="card-body shadow-sm col-9">
                                    {getValues(valueOption)?.map((valueField, i) => (
                                      <div className="mb-4 d-flex" key={uuidv4()}>
                                        <label className="col-2 text-start ">Phân loại hàng</label>
                                        <div className="col-10 d-flex">
                                          <input
                                            {...register(`${valueOption}.${i}`, {
                                              required: 'This is required',
                                            })}
                                            className="flex-grow-1 form-control"
                                            name={`${valueOption}.${i}`}
                                            type="text"
                                            placeholder="Nhập tên nhóm phân loại"
                                            aria-label="Price"
                                            aria-describedby="basic-addon1"
                                          ></input>{' '}
                                          {getValues(valueOption).length > 1 && (
                                            <span
                                              onClick={() => {
                                                if (dem == 0) {
                                                  if (valueOption === 'size') {
                                                    setValue(
                                                      `variants`,
                                                      getValues(`variants`).filter((value, ind) => ind !== i),
                                                    );
                                                    setValue(
                                                      'size',
                                                      getValues('size').filter((value, ind) => ind !== i),
                                                    );
                                                    setSize((pre) => {
                                                      //   unregister(`size.${i}`);

                                                      return [...pre.filter((value, ind) => ind !== i)];
                                                    });
                                                  } else {
                                                    setValue(
                                                      `variants`,
                                                      getValues(`variants`).map((value) =>
                                                        value.field.reduce(
                                                          (variants, variant, i) => {
                                                            if (variant.color !== valueField)
                                                              variants = { field: [...variants.field, variant] };
                                                            return variants;
                                                          },
                                                          { field: [] },
                                                        ),
                                                      ),
                                                    );
                                                    setValue(
                                                      'color',
                                                      getValues('color').filter((value, ind) => ind !== i),
                                                    );
                                                    setColor((pre) => {
                                                      return [...pre.filter((value, ind) => ind !== i)];
                                                    });
                                                  }
                                                }

                                                dem++;
                                              }}
                                              style={{
                                                display: 'flex',
                                                margin: '15px',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                              }}
                                            >
                                              <i className="fas fa-trash-alt" style={{ color: 'red' }}></i>
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                    {getValues(valueOption).length <= 10 && (
                                      <div className="mb-4 d-flex">
                                        <div
                                          style={{ cursor: 'pointer' }}
                                          className="flex-grow-1 d-flex justify-content-center"
                                          onClick={() => {
                                            if (index === 0) {
                                              setValue(valueOption, [...getValues(valueOption), '']);
                                              setValue(`variants.${getValues('variants').length}`, {
                                                field: getValues('color').reduce((newArray, value, index) => {
                                                  newArray.push({ size: '', color: '', price: '', quantity: '' });
                                                  return newArray;
                                                }, []),
                                              });

                                              setSize((pre) => [...pre, '']);
                                            } else {
                                              setValue(valueOption, [...getValues(valueOption), '']);
                                              setValue(
                                                'variants',
                                                getValues('variants').map((value, indexOfVarian) => {
                                                  value.field.push({ size: '', color: '', price: '', quantity: '' });
                                                  return value;
                                                }),
                                              );

                                              setColor((pre) => [...pre, '']);
                                            }
                                          }}
                                        >
                                          <i class="icon fas fa-plus m-1"></i>
                                          <p>Add classify product</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </>
                            );
                          })}
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              checked={changeForALL}
                              id="defaultCheck1"
                              onChange={(e) => {
                                e.target.checked ? setChangForAll(true) : setChangForAll(false);
                              }}
                            />
                            <label class="form-check-label" for="defaultCheck1">
                              Apply to all product
                            </label>
                          </div>
                          <table class="table">
                            {' '}
                            <thead>
                              <tr>
                                <th scope="col">Price</th>
                                <th scope="col">Quantity</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <input
                                    {...register('price')}
                                    className="border-0 input "
                                    placeholder="Enter price"
                                    type={'number'}
                                  ></input>
                                </td>
                                <td>
                                  <input
                                    className="border-0 input "
                                    type={'number'}
                                    {...register('quantity')}
                                    placeholder="Enter quantity"
                                  />{' '}
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          <div className="mb-4 d-flex">
                            <label className="col-3 text-start ">List of classify of goods </label>
                            <div className="col-9 d-flex">
                              <table class="table">
                                <thead>
                                  <tr>
                                    <th scope="col">Size</th>

                                    <th scope="col">Color</th>

                                    <th scope="col">Price</th>
                                    <th scope="col">Quantity</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {getValues('size')?.map((value1, iClass1) => {
                                    return getValues('color')?.map((value2, iClass2) => {
                                      setValue(`variants.${iClass1}.field.${iClass2}.size`, value1);
                                      setValue(`variants.${iClass1}.field.${iClass2}.color`, value2);
                                      if (changeForALL) {
                                        setValue(`variants.${iClass1}.field.${iClass2}.price`, watch('price'));
                                        setValue(`variants.${iClass1}.field.${iClass2}.quantity`, watch('quantity'));
                                      }
                                      return (
                                        <tr>
                                          <td className="col-3">{value1 || '?'}</td>
                                          <td className="col-3">{value2 || '?'}</td>
                                          <td className="col-3">
                                            <input
                                              className=""
                                              placeholder="Enter price"
                                              {...register(`variants.${iClass1}.field.${iClass2}.price`, {
                                                required: 'This is required',
                                                validate: {
                                                  positive: (value) => value > 0 && value < 10000,
                                                },
                                              })}
                                            ></input>
                                          </td>
                                          <td className="col-3">
                                            <input
                                              className="flex-grow-1"
                                              placeholder="Enter quantity"
                                              {...register(`variants.${iClass1}.field.${iClass2}.quantity`, {
                                                required: 'This is required',
                                                validate: {
                                                  positive: (value) => value > 0 && value < 10000,
                                                },
                                              })}
                                            ></input>
                                          </td>
                                        </tr>
                                      );
                                    });
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default EditProductMain;
