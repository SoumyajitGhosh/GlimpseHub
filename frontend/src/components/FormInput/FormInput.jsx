import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon/Icon';

const FormInput = ({
    type,
    style,
    valid,
    placeholder,
    fieldProps,
    id,
    ...additionalProps
}) => {
    const [inputType, setInputType] = useState('password');
    const handleClick = () => {
        inputType === 'password' ? setInputType('text') : setInputType('password');
    };

    // Prefer an explicit id, then a name prop, and fall back to a slug of the
    // placeholder so the <label htmlFor> below always has something to point at.
    const inputId =
        id ||
        additionalProps.name ||
        (placeholder && placeholder.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

    return (
        <div
            style={{ ...style, marginBottom: !placeholder ? '0' : '0.5rem' }}
            data-test="component-input"
            className="form-group"
        >
            <input
                id={inputId}
                className="form-group__input"
                type={type === 'password' ? inputType : type}
                placeholder={placeholder}
                style={!placeholder ? { padding: '1rem' } : {}}
                {...fieldProps}
                {...additionalProps}
            />
            {placeholder && (
                <label htmlFor={inputId} className="form-group__placeholder">
                    {placeholder}
                </label>
            )}
            <div className="input-icons">
                {typeof valid === 'boolean' ? (
                    valid ? (
                        <Icon className="color-grey" icon="checkmark-circle-outline" />
                    ) : (
                        <Icon className="color-red" icon="close-circle-outline" />
                    )
                ) : null}
                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => handleClick()}
                        className="form-group__toggle"
                        aria-label={inputType === 'password' ? 'Show password' : 'Hide password'}
                    >
                        {inputType === 'password' ? 'Show' : 'Hide'}
                    </button>
                )}
            </div>
        </div>
    );
};

FormInput.propTypes = {
    placeholder: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
    id: PropTypes.string,
};

export default FormInput;