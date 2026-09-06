import { useEffect, useRef } from "react";
import throttle from "lodash/throttle";

/**
 * Gets the current scroll position
 * @function getCurrentScrollPosition
 * @param {HTMLElement} element The element to retrieve a scroll position from
 */
const getCurrentScrollPosition = (element) => {
  const { scrollTop } = element;
  return scrollTop;
};

/**
 * A throttled hook to execute a function upon scroll
 * @function useScrollPositionThrottled
 * @param {function} callback Callback function to call when a user scrolls
 * @param {{ current: HTMLElement }} [elementRef] Ref to the element to calculate the scroll position from, the default is document
 * @param {array} deps Dependency array
 */
const useScrollPositionThrottled = (callback, elementRef, deps = []) => {
  const scrollPosition = useRef(0);

  /**
   * Handles determining positional values when scrolling
   * @function handleScroll
   */
  useEffect(() => {
    const element = elementRef?.current;
    const currentElement = element ? element : document.documentElement;
    scrollPosition.current = getCurrentScrollPosition(currentElement);

    const handleScroll = () => {
      scrollPosition.current = getCurrentScrollPosition(currentElement);
      callback({
        currentScrollPosition: scrollPosition.current,
        atBottom:
          currentElement.scrollHeight -
            currentElement.scrollTop -
            currentElement.clientHeight <
          1000,
      });
    };
    // Throttle the function to improve performance
    const handleScrollThrottled = throttle(handleScroll, 200);
    element
      ? element.addEventListener("scroll", handleScrollThrottled)
      : window.addEventListener("scroll", handleScrollThrottled);

    return () => {
      element
        ? element.removeEventListener("scroll", handleScrollThrottled)
        : window.removeEventListener("scroll", handleScrollThrottled);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, elementRef, callback]);
};

export default useScrollPositionThrottled;
