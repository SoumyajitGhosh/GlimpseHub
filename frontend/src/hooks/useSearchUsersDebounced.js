import { useState, useRef } from 'react';
import debounce from 'lodash/debounce';

import { searchUsers } from '../services/userService';

/**
 * A memoized debounced hook to search for users with a given offset
 * @function useSearchUsersDebounced
 * @returns {object} Search function and search result
 */
const useSearchUsersDebounced = () => {
    const [result, setResult] = useState([]);
    const [fetching, setFetching] = useState(false);

    const handleSearch = async (string, offset) => {
        if (!string) {
            setFetching(false);
            return setResult([]);
        }

        try {
            const response = await searchUsers(string, offset);
            setResult(response ? response : []);
            setFetching(false);
        } catch (err) {
            setFetching(false);
            throw new Error(err);
        }
    };
    const debouncedRef = useRef(null);
    if (debouncedRef.current == null) {
        debouncedRef.current = debounce(handleSearch, 500);
    }
    // Returning a ref's current value as a stable function identity is a
    // deliberate "instance value" pattern (react.dev/reference/react/useRef),
    // not a render-output read.
    // eslint-disable-next-line react-hooks/refs -- lazy-initialized singleton, not a render-output read
    const handleSearchDebouncedRef = debouncedRef.current;
    return {
        handleSearchDebouncedRef,
        result,
        setResult,
        fetching,
        setFetching,
    };
};

export default useSearchUsersDebounced;