import React, { useEffect, useState } from 'react';

export default function VerifyRegisterSuccess({ location, history }) {
    const [loading, setLoading] = useState(false);
    const email = location.search ? location.search.split('=')[1] : 'nulll';
    setTimeout(() => {}, 2000);
    useEffect(() => {
        if (loading === false) {
            const timeOut = setTimeout(() => {
                setLoading(true);
            }, 500);
        }
        // return clearTimeout(timeOut);
    }, []);
    return (
        <>
            {loading && (
                <div className="container d-flex flex-column justify-content-center align-items-center login-center">
                    <form className="Login col-md-6 col-lg-4 col-10">
                        <div
                            style={{
                                height: '40px',
                                margin: '10px',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <img
                                style={{
                                    height: '100%',
                                }}
                                src="https://scontent.fsgn5-10.fna.fbcdn.net/v/t1.15752-9/290316587_586427556449035_3497678023536528746_n.png?_nc_cat=107&ccb=1-7&_nc_sid=ae9488&_nc_ohc=OomrRlOp2BYAX-vVcwM&_nc_ht=scontent.fsgn5-10.fna&oh=03_AVKrOr3fH2fhaIOOvUnNbSboJdrdM03_sU2b-M9d8RzhKg&oe=6320B38D"
                            />
                        </div>
                        <h4 style={{ color: '#127412' }}>Great, now verify your email</h4>
                        <div
                            style={{
                                // height: '250px',
                                margin: '10px',
                            }}
                        >
                            <img
                                style={{
                                    width: '230px',
                                }}
                                src="https://scontent.xx.fbcdn.net/v/t1.15752-9/298027259_3213264782324797_2189087690777944740_n.png?stp=dst-png_p206x206&_nc_cat=102&ccb=1-7&_nc_sid=aee45a&_nc_ohc=MQf0-cGNiOgAX8GBkDe&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AVI5Frrgq_K0mybcpnXX4zWKBiV9q6KEsta6vK0Dwg4z6Q&oe=6320DFFD"
                                // src="https://account.mongodb.com/static/dist/images/953862e6f29d77cebef307438ae8c10a.png"
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                            <h4
                                style={{
                                    color: 'rgb(61, 79, 88)',
                                    fontSize: '15px',
                                    letterSpacing: '0px',
                                    linHeight: '19px',
                                    marginBlockEnd: '1em',
                                    marginInlineStart: '0px',
                                    marginInlineEnd: '0px',
                                }}
                            >{`Check your inbox at <${email?.toString()}> and click the verification link inside to complete your registration. This link will expire shortly, so verify soon!`}</h4>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <p
                                style={{
                                    fontWeight: 600,
                                    marginRight: '5px',
                                }}
                            >
                                Don't see an email?
                            </p>
                            <p>Check your spam folder.</p>
                        </div>
                        <div></div>
                    </form>
                </div>
            )}
        </>
    );
}
