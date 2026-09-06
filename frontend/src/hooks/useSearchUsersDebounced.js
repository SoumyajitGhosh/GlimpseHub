import { useState, useRef } from "react";
import debounce from "lodash/debounce";

import { searchUsers } from "../services/userService";

/**
 * A memoized debounced hook to search for users with a given offset.
 * Each new search aborts the previous in-flight request so a slow earlier
 * response can never overwrite the results of a later query.
 * @function useSearchUsersDebounced
 * @returns {object} Search function and search result
 */
const useSearchUsersDebounced = () => {
  const [result, setResult] = useState([]);
  const [fetching, setFetching] = useState(false);
  const abortRef = useRef(null);

  const handleSearch = async (string, offset) => {
    abortRef.current?.abort();

    if (!string) {
      setFetching(false);
      return setResult([]);
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await searchUsers(string, offset, {
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      setResult(response ?? []);
      setFetching(false);
    } catch (err) {
      if (err.code === "ERR_CANCELED" || err.name === "CanceledError") return;
      setFetching(false);
    }
  };

  // Lazily-initialised, stable-identity debounced function — the documented
  // useRef "instance value" pattern (react.dev/reference/react/useRef). The
  // read and the one-time write both happen during render by design, so both
  // are scoped out of react-hooks/refs.
  const debouncedRef = useRef(null);
  if (debouncedRef.current == null) {
    // eslint-disable-next-line react-hooks/refs -- one-time lazy init of an instance value
    debouncedRef.current = debounce(handleSearch, 500);
  }
  // eslint-disable-next-line react-hooks/refs -- stable instance value, not a render-output read
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
