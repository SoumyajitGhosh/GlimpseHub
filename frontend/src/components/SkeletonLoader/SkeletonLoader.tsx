import type { CSSProperties } from "react";

interface SkeletonLoaderProps {
  style?: CSSProperties;
  animated?: boolean;
}

const SkeletonLoader = ({ style, animated }: SkeletonLoaderProps) => {
  return animated ? (
    <div style={style} className="skeleton-loader--animated"></div>
  ) : (
    <div style={style} className="skeleton-loader"></div>
  );
};

export default SkeletonLoader;
