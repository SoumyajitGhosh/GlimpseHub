import type { ReactNode } from "react";

interface ImageGridProps {
  children?: ReactNode;
}

const ImageGrid = ({ children }: ImageGridProps) => (
  <div className="image-grid">{children}</div>
);

export default ImageGrid;
