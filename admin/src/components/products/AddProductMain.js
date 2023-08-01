import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { PRODUCT_CREATE_RESET } from '../../Redux/Constants/ProductConstants';
import { createProduct } from './../../Redux/Actions/ProductActions';
import Loading from '../LoadingError/Loading';
import { ListCategory } from '../../Redux/Actions/categoryActions';
import isEmpty from 'validator/lib/isEmpty';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';

import { FileUploadDemo } from './UploadImage';

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};
const AddProductMain = () => {
  const [name, setName] = useState('');

  const [category, setCategory] = useState('');
  const [image, setImage] = useState();

  const [description, setDescription] = useState('');
  const [validate, setValidate] = useState({});

  const refInput = useRef();

  const dispatch = useDispatch();
  const [changeForALL, setChangForAll] = useState(false);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [reviewImage, setReviewImage] = useState('');
  const [clear, setClear] = useState(false);
  // const [groupProduct, setGroupProduct] = useState({ ...defaultGroupProduct });
  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, product } = productCreate;
  const lcategories = useSelector((state) => state.CategoryList);
  const { categories } = lcategories;

  const defaultGroupProduct = {
    option: ['size', 'color'],
    size: [''],
    color: [''],
    variants: [
      {
        field: [
          {
            size: '',
            color: '',
            quantity: '',
            price: '',
          },
        ],
      },
    ],
  };
  useEffect(() => {
    dispatch(ListCategory());
  }, []);
  //, touchedFields
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

  useEffect(() => {
    if (product) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      setName('');
      setDescription('');
      setCategory('');
      setImage('');
      setSize(['']);
      setColor(['']);
      // reset({ defaultValues: defaultGroupProduct });
      setValue('size', ['']);
      setValue('color', ['']);
      setValue('variants', ['']);
      setClear((pre) => !pre);
      setChangForAll('');
      reset();
    }
  }, [product, dispatch]);
  const isEmptyCheckEdit = () => {
    const msg = {};
    if (isEmpty(category)) {
      msg.category = 'Plesae input your category';
      msg.borderRed1 = 'border-red';
    }
    if (isEmpty(name)) {
      msg.name = 'Please input your name';
      msg.borderRed2 = 'border-red';
    }

    // if (isEmpty(image)) {
    //   msg.image = 'Please input your image';
    //   msg.borderRed4 = 'border-red';
    // }

    if (isEmpty(description)) {
      msg.description = 'Please input your description';
      msg.borderRed6 = 'border-red';
    }
    setValidate(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
  };

  const submitHandler = (data, e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please choose image!!', ToastObjects);
      return;
    }
    const isEmptyValidate = isEmptyCheckEdit();
    if (!isEmptyValidate) return;

    if (category != -1) {
      let newProduct = new FormData();
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
      newProduct.append('productImage', image);
      // dispatch(createProduct(imagef));
      // for (const value of newProduct.values()) {
      //   console.log(value);
      // }
      dispatch(
        // createProduct({
        //   name,
        //   description,
        //   category,
        //   image: image,
        //   variants: data.variants.reduce((variants, variant) => {
        //     variants = variants.concat(variant.field);
        //     return variants;
        //   }, []),
        // }),
        createProduct(newProduct),
      );
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
            <h2 className="content-title">Add product</h2>
            <div>
              <button type="submit" className="btn btn-primary color-orange">
                Add Product
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-xl-12 col-lg-12">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  {loading && <Loading />}
                  <div className="mb-4">
                    <label htmlFor="product_title" className="form-label">
                      Product title
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className={`form-control ${validate.borderRed2}`}
                      id="product_title"
                      //required
                      value={name}
                      onClick={() => {
                        setValidate((values) => {
                          const x = { ...values };
                          x.borderRed2 = '';
                          x.name = '';
                          return x;
                        });
                      }}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <p className="product_validate">{validate.name}</p>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="product_category" className="form-label">
                      Category
                    </label>
                    <select
                      type="text"
                      id="product_category"
                      //className="form-select"
                      className={`form-select ${validate.borderRed1}`}
                      aria-label=".form-select-lg example"
                      //required
                      value={category}
                      onClick={() => {
                        setValidate((values) => {
                          const x = { ...values };
                          x.borderRed1 = '';
                          x.category = '';
                          return x;
                        });
                      }}
                      onChange={(e) => setCategory(e.target.value)}
                      title="Please select category"
                      placeholder="Please select category"
                    >
                      <option value={-1} selected>
                        Please select category
                      </option>
                      {categories?.map((cate, index) => (
                        <option key={index} value={cate._id}>
                          {cate.name}
                        </option>
                      ))}
                    </select>
                    <p className="product_validate">{validate.category}</p>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Description</label>
                    <textarea
                      placeholder="Type here"
                      className={`form-control ${validate.borderRed6}`}
                      rows="7"
                      //required
                      value={description}
                      onClick={() => {
                        setValidate((values) => {
                          const x = { ...values };
                          x.borderRed6 = '';
                          x.description = '';
                          return x;
                        });
                      }}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    <p className="product_validate">{validate.description}</p>
                  </div>
                  <div className="mb-4">
                    {/* <label className="form-label">Images</label> */}
                    {/* {image && <img src={URL.createObjectURL(image)} />} */}
                    {/* <input
                      className={`form-control ${validate.borderRed4}`}
                      type="text"
                      placeholder="Enter Image URL"
                      value={image}
                      //required
                      onClick={() => {
                        setValidate((values) => {
                          const x = { ...values };
                          x.borderRed4 = '';
                          x.image = '';
                          return x;
                        });
                      }}
                      onChange={(e) => setImage(e.target.value)}
                    />
                    <p className="product_validate">{validate.image}</p> */}
                    {/* <input
                      {...register('picture')}
                      className="form-control mt-3"
                      type="file"
                      // onChange={(e) => {

                      //   setImage(e.target.files[0]);
                      // }}
                    /> */}
                    <FileUploadDemo setImage={(value) => setImage(value)} name={name} clear={clear} />
                  </div>
                </div>
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
                        <div className="mb-4 d-flex" ref={refInput} key={uuidv4()}>
                          <div className="col-3">{index == 0 ? 'Size' : 'Color'}</div>
                          <div className="card-body shadow-sm col-9">
                            {getValues(valueOption)?.map((valueField, i) => (
                              <div className="mb-4 d-flex" key={uuidv4()}>
                                <label className="col-2 text-start ">Name of classify</label>
                                <div className="col-10 d-flex">
                                  <input
                                    {...register(`${valueOption}.${i}`, {
                                      required: 'This is required',
                                    })}
                                    className="flex-grow-1 form-control"
                                    name={`${valueOption}.${i}`}
                                    type="text"
                                    placeholder="Enter name of classify"
                                    aria-label="Price"
                                    aria-describedby="basic-addon1"
                                  ></input>{' '}
                                  {getValues(valueOption).length > 1 && (
                                    <span
                                      onClick={() => {
                                        if (getValues(valueOption).length > 1) {
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
                                                return [...pre.filter((value, ind) => ind !== i)];
                                              });
                                            } else {
                                              setValue(
                                                `variants`,
                                                getValues(`variants`)?.map((value) =>
                                                  value.field?.reduce(
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
                                    // setValue(`${index == 0 ? 'size' : 'color'}`, [
                                    //     ...watch(`${index == 0 ? 'size' : 'color'}`),
                                    //     null,
                                    // ]);

                                    if (index === 0) {
                                      setValue(valueOption, [...getValues(valueOption), '']);
                                      // register(
                                      //     `${valueOption}.${
                                      //         getValues('size').length || 0
                                      //     }`,
                                      // );
                                      setSize((pre) => [...pre, '']);
                                    } else {
                                      setValue(valueOption, [...getValues(valueOption), '']);
                                      // register(
                                      //     `${valueOption}.${
                                      //         getValues('color').length || 0
                                      //     }`,
                                      // );
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
                            type="number"
                          ></input>
                        </td>
                        <td>
                          <input
                            className="border-0 input "
                            type="number"
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
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddProductMain;
