import React from "react";
import { Routes, Route } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectToken } from "../../redux/user/userSelectors";
import { showAlert } from "../../redux/alert/alertActions";
import { showModal } from "../../redux/modal/modalActions";
import SuggestedPosts from "../../components/SuggestedPosts/SuggestedPosts";
import HashtagPosts from "../../components/HashtagPosts/HashtagPosts";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

const ExplorePage = ({ token, showAlert, showModal }) => {
  return (
    <main className="explore-page grid">
      <Routes>
        <Route
          path="/"
          element={
            <SuggestedPosts
              token={token}
              showModal={showModal}
              showAlert={showAlert}
            />
          }
        />
        <Route
          path="tags/:hashtag"
          element={
            <HashtagPosts
              token={token}
              showModal={showModal}
              showAlert={showAlert}
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
});

const mapDispatchToProps = (dispatch) => ({
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
  showModal: (props, component) => dispatch(showModal(props, component)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExplorePage);
