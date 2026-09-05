import React from 'react';

const FormTextarea = ({ children, fieldProps, ...additionalProps }) => (
    <textarea
        id={additionalProps.id || additionalProps.name}
        className="form-group__textarea"
        {...fieldProps}
        {...additionalProps}
    >
        {children}
    </textarea>
);

export default FormTextarea;