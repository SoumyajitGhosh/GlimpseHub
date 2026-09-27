import { Fragment } from "react";
import type { CSSProperties, ReactNode } from "react";

import SkeletonLoader from "../../SkeletonLoader/SkeletonLoader";

interface UsersListSkeletonProps {
  amount?: number;
  style?: CSSProperties;
}

const UsersListSkeleton = ({ amount = 3, style }: UsersListSkeletonProps) => {
  const renderSkeleton = () => {
    const skeleton: ReactNode[] = [];
    for (let i = 0; i < amount; i++) {
      skeleton.push(
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0.5rem 1.5rem",
            ...style,
          }}
        >
          <SkeletonLoader
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "100px",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SkeletonLoader
              style={{
                width: "10rem",
                height: "1rem",
                marginLeft: "1rem",
                marginBottom: "5px",
              }}
            />
            <SkeletonLoader
              style={{ width: "15rem", height: "1rem", marginLeft: "1rem" }}
            />
          </div>
        </div>
      );
    }
    return skeleton;
  };

  return <Fragment>{renderSkeleton()}</Fragment>;
};

export default UsersListSkeleton;
