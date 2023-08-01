import React, { useEffect, useState } from 'react';

export default function useDebounce(value, delay) {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const handleClear = setTimeout(() => {
            setDebounceValue(value);
        }, delay);
        return () => clearTimeout(handleClear);
    }, [value]);
    return debounceValue;
}
