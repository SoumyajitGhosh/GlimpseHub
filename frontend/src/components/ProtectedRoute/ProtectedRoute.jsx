// import React from "react";
// import { connect } from "react-redux";
// import { createStructuredSelector } from "reselect";
// import { Route, Navigate } from "react-router-dom";

// import { selectToken } from "../../redux/user/userSelectors";

// const ProtectedRoute = ({ token, children, ...props }) => {
//   return (
//     <Route {...props}>{token ? children : <Navigate to="/login" />}</Route>
//   );
// };

// const mapStateToProps = createStructuredSelector({
//   token: selectToken,
// });

// export default connect(mapStateToProps)(ProtectedRoute);

// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { selectCurrentUser } from "../../redux/user/userSelectors";

const ProtectedRoute = ({ currentUser, element }) => {
  return currentUser ? element : <Navigate to="/login" />;
};

const mapStateToProps = (state) => ({
  currentUser: selectCurrentUser(state),
});

export default connect(mapStateToProps)(ProtectedRoute);
