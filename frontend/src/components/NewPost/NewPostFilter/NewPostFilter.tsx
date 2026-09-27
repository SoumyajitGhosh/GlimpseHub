import { Fragment } from "react";

import FilterSelector from "../../FilterSelector/FilterSelector";
import SkeletonLoader from "../../SkeletonLoader/SkeletonLoader";
import type { Filter } from "../../../types";
import type { PreviewImageState, SetPreviewImage } from "../NewPost";

interface NewPostFilterProps {
  previewImage: PreviewImageState;
  setPreviewImage: SetPreviewImage;
  filters: Filter[];
}

const NewPostFilter = ({
  previewImage,
  setPreviewImage,
  filters,
}: NewPostFilterProps) => {
  // `readAsDataURL` (the only reader method used here) always yields a
  // string; the wider `string | ArrayBuffer | null` comes from FileReader's
  // generic `result` type covering its other read methods.
  const src =
    typeof previewImage.src === "string" ? previewImage.src : undefined;

  return (
    <Fragment>
      <div className="new-post__preview">
        <div className="new-post__preview-image-container">
          {src ? (
            <img
              src={src}
              alt="Customize"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                filter: previewImage.filter ?? undefined,
              }}
            />
          ) : (
            <SkeletonLoader />
          )}
        </div>
      </div>
      <FilterSelector
        setFilter={(filter, filterName) =>
          setPreviewImage((previous) => ({ ...previous, filter, filterName }))
        }
        previewImage={src}
        filters={filters}
      />
    </Fragment>
  );
};

export default NewPostFilter;
