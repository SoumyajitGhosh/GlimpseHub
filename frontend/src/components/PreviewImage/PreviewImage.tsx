import type { MouseEventHandler } from "react";

import Icon from "../Icon/Icon";

interface PreviewImageProps {
  onClick?: MouseEventHandler<HTMLElement>;
  image: string;
  likes: number;
  comments: number;
  filter?: string;
}

const PreviewImage = ({
  onClick,
  image,
  likes,
  comments,
  filter,
}: PreviewImageProps) => (
  <figure onClick={onClick} key={image} className="preview-image">
    <img src={image} alt="User post" style={{ filter }} />
    <div className="preview-image__overlay">
      <span className="preview-image__content">
        {likes > 0 && (
          <div className="preview-image__icon">
            <Icon icon="heart" className="icon--white" />
            <span>{likes}</span>
          </div>
        )}
        <div className="preview-image__icon">
          <Icon icon="chatbubbles" className="icon--white" />
          <span>{comments}</span>
        </div>
      </span>
    </div>
  </figure>
);

export default PreviewImage;
