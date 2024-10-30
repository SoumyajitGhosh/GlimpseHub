import React from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";

import NewPost from "../../components/NewPost/NewPost";

const NewPostPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // useLocation hook to access location

  return location.state && location.state.file ? (
    <NewPost file={location.state.file} hide={() => navigate("/")} />
  ) : (
    <Navigate to="/" />
  );
};

export default NewPostPage;
