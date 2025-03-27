"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SkeletonBlock({
  height = 20,
  width = "100%",
  count = 1,
  className = "",
}) {
  return (
    <Skeleton
      count={count}
      height={height}
      width={width}
      baseColor="var(--gray-light)"
      highlightColor="#e0e0e0"
      borderRadius={12}
      className={`rounded-xl ${className}`}
    />
  );
}
