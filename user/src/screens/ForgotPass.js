import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import Loading, { FormLoading } from '../components/LoadingError/Loading';
import Toast from '../components/LoadingError/Toast';
import { Controller, useForm } from 'react-hook-form';
import image from '~/assets/images/index.js';
import { forGotPassWord } from '~/Redux/Actions/userActions';

export default function ForgotPass({ history }) {
    const dispatch = useDispatch();
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();
    const userLogin = useSelector((state) => state.userLogin);
    const { error, loading, userInfo } = userLogin;

    const forgotPassword = useSelector((state) => state.forgotPassword);
    const { error: errorForgot, loading: loadingForgot, success: successForgot } = forgotPassword;

    const onSubmit = (data) => {
        dispatch(forGotPassWord(data, history));
    };
    return (
        <>
            <Header />
            <Toast />
            <div className="container d-flex flex-column justify-content-center align-items-center login-center">
                <form className="Login col-md-6 col-lg-4 col-10" onSubmit={handleSubmit(onSubmit)}>
                    {/* {loading && <FormLoading />} */}

                    {loadingForgot && <FormLoading />}

                    <div
                        style={{
                            height: '40px',
                        }}
                    >
                        <img
                            src={image.logo}
                            style={{
                                height: '100%',
                            }}
                        />
                    </div>
                    <h5 className="d-block" style={{ margin: '15px' }}>
                        RESET PASSWORD
                    </h5>

                    <div
                        style={{
                            padding: '10px 10px 30px 10px',
                        }}
                    >
                        <span>
                            To reset your password, enter your email below and submit. An email will be sent to you with
                            instructions about how to complete the process.
                        </span>
                    </div>
                    <Controller
                        name="emailReset"
                        control={control}
                        render={({ field }) => <input {...field} placeholder="Enter your address" />}
                        rules={{
                            required: true,
                            pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                        }}
                    />
                    {errors.emailReset && (
                        <p className="text-danger">'Wrong or Invalid email address. Please correct and try again'</p>
                    )}
                    {successForgot ? (
                        <p className="text-success">Verify email to reset password is sent, please check your inbox</p>
                    ) : (
                        <button className="btn btn-outline-danger btn__login" type="submit">
                            Reset password
                        </button>
                    )}
                    <label></label>
                </form>
            </div>
        </>
    );
}
