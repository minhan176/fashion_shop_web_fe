import React from 'react';

const ConfirmModal = (data) => {
    const { content, handleSubmit } = data;
    const { title = 'Title', body = 'body' } = content;

    return (
        <>
            {
                <div
                    class="modal fade"
                    id="staticBackdrop"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabindex="-1"
                    aria-labelledby="staticBackdropLabel"
                    aria-hidden="true"
                >
                    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header">
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'row-reverse',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'flex-end',
                                            backgroundColor: 'none',
                                        }}
                                    >
                                        <button
                                            style={{ backgroundColor: 'transparent' }}
                                            type="button"
                                            class="btn-close"
                                            aria-label="Close"
                                            data-bs-dismiss="modal"
                                        ></button>
                                    </div>
                                    <h5
                                        class="modal-title"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'start',
                                        }}
                                    >
                                        {title || 'Title'}
                                    </h5>
                                </div>
                            </div>
                            <div
                                class="modal-body"
                                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}
                            >
                                <span>{body || 'Body'}</span>
                            </div>
                            <div
                                class="modal-footer d-flex align-content-center justify-center "
                                style={{ display: 'flex', flexDirection: 'row' }}
                            >
                                <button
                                    type="button"
                                    class="btn btn-danger col-2"
                                    data-bs-dismiss="modal"
                                    // style={{''}}
                                    style={{
                                        width: '5rem',
                                        // height: '2.5rem',
                                        backgroundColor: '#6c757d',
                                    }}
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    class="btn btn-outline-primary col-2"
                                    data-bs-dismiss="modal"
                                    onClick={handleSubmit}
                                    style={{
                                        width: '5rem',
                                        backgroundColor: '#0d6efd',
                                        // height: '2.5rem',
                                        color: 'white',
                                    }}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};
export default React.memo(ConfirmModal);
