import React from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import { confirmable, createConfirmation } from 'react-confirm';
import { ModalDialog } from 'react-bootstrap';

export const Confirmation = ({
    okLabel = 'OK',
    cancelLabel = 'Cancel',
    title = 'Confirmation',
    confirmation,
    show,
    proceed,
    enableEscape = true,
}) => {
    return (
        <div className="static-modal">
            <ModalDialog
                animation={false}
                show={show}
                onHide={() => proceed(false)}
                backdrop={enableEscape ? true : 'static'}
                keyboard={enableEscape}
            >
                <ModalDialog.Header>
                    <ModalDialog.Title>{title}</ModalDialog.Title>
                </ModalDialog.Header>
                <ModalDialog.Body>{confirmation}</ModalDialog.Body>
                <ModalDialog.Footer>
                    <Button onClick={() => proceed(false)}>{cancelLabel}</Button>
                    <Button className="button-l" bsStyle="primary" onClick={() => proceed(true)}>
                        {okLabel}
                    </Button>
                </ModalDialog.Footer>
            </ModalDialog>
        </div>
    );
};

Confirmation.propTypes = {
    okLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    title: PropTypes.string,
    confirmation: PropTypes.string,
    show: PropTypes.bool,
    proceed: PropTypes.func, // called when ok button is clicked.
    enableEscape: PropTypes.bool,
};

export function confirm(confirmation, proceedLabel = 'OK', cancelLabel = 'cancel', options = {}) {
    return createConfirmation(confirmable(Confirmation))({
        confirmation,
        proceedLabel,
        cancelLabel,
        ...options,
    });
}
