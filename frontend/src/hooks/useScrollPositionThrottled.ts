import { useEffect, useRef } from "react";
import type { DependencyList, RefObject } from "react";
import throttle from "lodash/throttle";

export interface ScrollPositionInfo {
  currentScrollPosition: number;
  atBottom: boolean;
}

export type ScrollPositionCallback = (info: ScrollPositionInfo) => void;

const getCurrentScrollPosition = (element: Element): number => {
  const { scrollTop } = element;
  return scrollTop;
};

/**
 * A throttled hook to execute a function upon scroll.
 * @param callback Callback to call when a user scrolls
 * @param elementRef Ref to the element to calculate the scroll position from; the default is the document
 * @param deps Dependency array
 */
const useScrollPositionThrottled = (
  callback: ScrollPositionCallback,
  elementRef?: RefObject<HTMLElement | null> | null,
  deps: DependencyList = []
): void => {
  const scrollPosition = useRef(0);

  useEffect(() => {
    const element = elementRef?.current ?? null;
    const currentElement: Element = element
      ? element
      : document.documentElement;
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
