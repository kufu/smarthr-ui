import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, } from 'react';
import { Input } from '../Input';
import { formatCurrency } from './currencyInputHelper';
import { useClassNames } from './useClassNames';
export const CurrencyInput = forwardRef(({ onFormatValue, onFocus, onBlur, className = '', ...props }, ref) => {
    const innerRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    useImperativeHandle(ref, () => innerRef.current);
    const formatValue = useCallback((formatted = '') => {
        if (!innerRef.current || formatted === innerRef.current.value) {
            return;
        }
        innerRef.current.value = formatted;
        onFormatValue && onFormatValue(formatted);
    }, [onFormatValue]);
    useEffect(() => {
        if (props.value === undefined && props.defaultValue !== undefined) {
            formatValue(formatCurrency(props.defaultValue));
        }
        // when component did mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (!isFocused) {
            if (props.value !== undefined) {
                // for controlled component
                formatValue(formatCurrency(props.value));
            }
            else if (innerRef.current) {
                // for uncontrolled component
                formatValue(formatCurrency(innerRef.current.value));
            }
        }
    }, [isFocused, props.value, formatValue]);
    const handleFocus = (e) => {
        setIsFocused(true);
        if (innerRef.current) {
            const commaExcluded = innerRef.current.value.replace(/,/g, '');
            formatValue(commaExcluded);
        }
        onFocus && onFocus(e);
    };
    const handleBlur = (e) => {
        setIsFocused(false);
        onBlur && onBlur(e);
    };
    const classNames = useClassNames();
    return (
    // eslint-disable-next-line smarthr/a11y-input-has-name-attribute
    React.createElement(Input, { ...props, type: "text", onFocus: handleFocus, onBlur: handleBlur, ref: innerRef, className: `${className} ${classNames.wrapper}` }));
});
//# sourceMappingURL=CurrencyInput.js.map