import React from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { selectToken } from "../../redux/user/userSelectors";
import { showAlert } from "../../redux/alert/alertActions";
import { showModal } from "../../redux/modal/modalActions";
import SuggestedPosts from "../../components/SuggestedPosts/SuggestedPosts";
import HashtagPosts from "../../components/HashtagPosts/HashtagPosts";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

const ExplorePage = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  const handleShowAlert = (text, onClick) => dispatch(showAlert(text, onClick));
  const handleShowModal = (props, component) =>
    dispatch(showModal(props, component));

  return (
    <main className="explore-page grid">
      <Routes>
        <Route
          path="/"
          element={
            <SuggestedPosts
              token={token}
              showModal={handleShowModal}
              showAlert={handleShowAlert}
            />
          }
        />
        <Route
          path="tags/:hashtag"
          element={
            <HashtagPosts
              token={token}
              showModal={handleShowModal}
              showAlert={handleShowAlert}
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
};

export default ExplorePage;
