// src/components/ui/SkeletonBlock.js
"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Skeleton loader avancé (Meta++)
 * @param {Object} props
 */
export default function SkeletonBlock({
  height = 20,
  width = "100%",
  count = 1,
  className = "",
  containerClass = "",
}) {
  return (
    <div className={containerClass}>
      <Skeleton
        count={count}
        height={height}
        width={width}
        baseColor="var(--gray-light)"
        highlightColor="#e0e0e0"
        borderRadius={12}
        className={`rounded-xl ${className}`}
      />
    </div>
  );
}
