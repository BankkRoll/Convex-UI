"use client";

import { useCallback, useRef } from "react";

interface UseChatScrollOptions {
  scrollThreshold?: number;
}

export function useChatScroll({
  scrollThreshold = 100,
}: UseChatScrollOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior,
      });
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      isAtBottomRef.current =
        scrollHeight - scrollTop - clientHeight < scrollThreshold;
    }
  }, [scrollThreshold]);

  const shouldAutoScroll = useCallback(() => {
    return isAtBottomRef.current;
  }, []);

  return {
    containerRef,
    scrollToBottom,
    handleScroll,
    shouldAutoScroll,
  };
}
