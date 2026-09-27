import type { Dispatch, SetStateAction } from "react";
import { useState, useEffect } from "react";

import { getPostFilters } from "../../services/postService";
import type { Filter } from "../../types";

import NewPostForm from "./NewPostForm/NewPostForm";
import NewPostFilter from "./NewPostFilter/NewPostFilter";
import MobileHeader from "../Header/MobileHeader/MobileHeader";
import TextButton from "../Button/TextButton/TextButton";
import Icon from "../Icon/Icon";

/** Shared across NewPost/NewPostFilter/NewPostForm while building a post. */
export interface PreviewImageState {
  src: string | ArrayBuffer | null;
  crop: Record<string, unknown>;
  filter: string | null;
  filterName: string;
}

export type SetPreviewImage = Dispatch<SetStateAction<PreviewImageState>>;

interface NewPostProps {
  file: File;
  hide: () => void;
}

const NewPost = ({ file, hide }: NewPostProps) => {
  const [previewImage, setPreviewImage] = useState<PreviewImageState>({
    src: null,
    crop: {},
    filter: null,
    filterName: "",
  });
  const [activeSection, setActiveSection] = useState("filter");
  const [filters, setFilters] = useState<Filter[]>([]);

  // Load a preview image of the image to post
  useEffect(() => {
    if (file.type === "image/png" || file.type === "image/jpeg") {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        setPreviewImage((previous) => ({
          ...previous,
          src: event.target?.result ?? null,
        }));
      };
    } else {
      // Display error
    }
  }, [file]);

  useEffect(() => {
    (async function () {
      try {
        const response = await getPostFilters();
        setFilters(response.filters);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  const renderSections = () => {
    switch (activeSection) {
      case "details": {
        return (
          <NewPostForm
            file={file}
            previewImage={previewImage}
            back={() => setActiveSection("filter")}
            hide={() => hide()}
          />
        );
      }
      default: {
        return (
          <NewPostFilter
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
            filters={filters}
          />
        );
      }
    }
  };

  return (
    <section className="new-post">
      {activeSection !== "details" && (
        <MobileHeader show>
          <Icon
            icon="close-outline"
            onClick={() => hide()}
            style={{ cursor: "pointer" }}
          />
          <h3 className="heading-3">New Post</h3>
          <TextButton
            bold
            blue
            style={{ fontSize: "1.5rem" }}
            onClick={() => setActiveSection("details")}
          >
            Next
          </TextButton>
        </MobileHeader>
      )}
      {renderSections()}
      {activeSection !== "details" && (
        <nav className="new-post__nav">
          <ul>
            <li
              className={`new-post__nav-item ${
                activeSection === "filter" && "new-post__nav-item--active"
              }`}
              onClick={() => setActiveSection("filter")}
              style={{ width: "100%" }}
            >
              <h4 className="heading-4">Filter</h4>
            </li>
            {/* <li
              className={`new-post__nav-item ${
                activeSection === 'edit' && 'new-post__nav-item--active'
              }`}
              onClick={() => setActiveSection('edit')}
            >
              <h4 className="heading-4">Edit</h4>
            </li> */}
          </ul>
        </nav>
      )}
    </section>
  );
};

export default NewPost;
