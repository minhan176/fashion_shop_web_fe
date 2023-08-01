import { ErrorMessage } from '@hookform/error-message';
import React, { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { FormLoading } from '../components/LoadingError/Loading';
import image from '~/assets/images';
import { resetPassWord } from '~/Redux/Actions/userActions';

import Toast from '../components/LoadingError/Toast';

export default function ResetPass({ location, history }) {
    const resetPasswordToken = location.search ? location.search.split('=')[1] : 1;

    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.resetPassword);

    const {
        watch,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();
    // password.current = watch('password', '');
    const submitResetPassword = async (data) => {
        dispatch(
            resetPassWord(
                resetPasswordToken,
                { ...data, email: data.emailReset, confirmPassword: data.newPassConfirm },
                history,
            ),
        );
    };

    return (
        <>
            <Toast />
            <div className="container d-flex flex-column justify-content-center align-items-center login-center">
                <form className="Login col-md-6 col-lg-4 col-10" onSubmit={handleSubmit(submitResetPassword)}>
                    {loading && <FormLoading />}
                    <div className="d-flex align-content-center justify-content-center h-25-l">
                        <img src={image.logo}></img>
                    </div>
                    <h4>CREATE NEW PASSWORD</h4>
                    <Controller
                        name="emailReset"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: 'Please enter your email',
                            pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                        }}
                        render={({ field }) => <input {...field} placeholder="Enter your email" />}
                    />

                    {/* <ErrorMessage errors={errors} name="emailReset" render={({ message }) => <p>{message}</p>} /> */}
                    {errors.emailReset && errors.emailReset.type == 'required' && (
                        <p className="text-danger m-0">{errors.emailReset.message}</p>
                    )}
                    {errors.emailReset && errors.emailReset.type == 'pattern' ? (
                        <p className="text-danger m-0">Invalid email</p>
                    ) : null}

                    <Controller
                        name="newPassword"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                            <input type={'password'} {...field} placeholder="Enter your new password" />
                        )}
                        rules={{
                            minLength: 6,
                            required: 'Please your password',
                        }}
                    />
                    {errors.newPassword && errors.newPassword.type == 'required' ? (
                        <p className="text-danger m-0">{errors.newPassword.message}</p>
                    ) : null}

                    {errors.newPassword && errors.newPassword.type == 'minLength' ? (
                        <p className="text-danger m-0">Password must be at least 6 characters</p>
                    ) : null}

                    <Controller
                        name="newPassConfirm"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                            <input type={'password'} {...field} placeholder="Enter your confirm password" />
                        )}
                        rules={{
                            required: 'Please enter confirm password',
                            // pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                            validate: (value) => value === watch('newPassword'),
                        }}
                    />

                    {errors.newPassConfirm && errors.newPassConfirm.type === 'validate' ? (
                        <p className="text-danger m-0">
                            'Wrong or invalid confirm new password. Please correct and try again'
                        </p>
                    ) : null}

                    {errors.newPassConfirm && errors.newPassConfirm.type === 'required' ? (
                        <p className="text-danger m-0">
                            'Wrong or invalid confirm new password. Please correct and try again'
                        </p>
                    ) : null}
                    <button className="btn btn-outline-danger btn__login" type="submit">
                        Save password
                    </button>
                </form>
            </div>
        </>
    );
}
