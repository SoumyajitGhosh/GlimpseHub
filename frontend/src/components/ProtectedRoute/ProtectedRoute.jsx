import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Navigate, Outlet } from "react-router-dom";

import { selectToken } from "../../redux/user/userSelectors";

const ProtectedRoute = ({ token }) => {
  return token ? <Outlet /> : <Navigate to="/login" />;
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
});

export default connect(mapStateToProps)(ProtectedRoute);
