import React, { useEffect, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { useTransition, animated } from "react-spring";

import { selectCurrentUser } from "./redux/user/userSelectors";
import { signInStart } from "./redux/user/userActions";
import { connectSocket } from "./redux/socket/socketActions";
import { fetchNotificationsStart } from "./redux/notification/notificationActions";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Header from "./components/Header/Header";
import Modal from "./components/Modal/Modal";
import Alert from "./components/Alert/Alert";
import Footer from "./components/Footer/Footer";
import MobileNav from "./components/MobileNav/MobileNav";

import LoadingPage from "./pages/LoadingPage/LoadingPage";
import EditProfileForm from "./components/EditProfileForm/EditProfileForm";
import ChangePasswordForm from "./components/ChangePasswordForm/ChangePasswordForm";
import SuggestedPosts from "./components/SuggestedPosts/SuggestedPosts";
import HashtagPosts from "./components/HashtagPosts/HashtagPosts";
const ProfilePage = lazy(() => import("./pages/ProfilePage/ProfilePage"));
const PostPage = lazy(() => import("./pages/PostPage/PostPage"));
const ConfirmationPage = lazy(() =>
  import("./pages/ConfirmationPage/ConfirmationPage")
);
const SettingsPage = lazy(() => import("./pages/SettingsPage/SettingsPage"));
const ActivityPage = lazy(() => import("./pages/ActivityPage/ActivityPage"));
const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage/SignUpPage"));
const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const NewPostPage = lazy(() => import("./pages/NewPostPage/NewPostPage"));
const ExplorePage = lazy(() => import("./pages/ExplorePage/ExplorePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage"));

export function UnconnectedApp({
  signInStart,
  modal,
  alert,
  currentUser,
  connectSocket,
  fetchNotificationsStart,
}) {
  const token = localStorage.getItem("token");
  const { pathname } = useLocation();

  useEffect(() => {
    if (token) {
      signInStart(null, null, token);
      connectSocket();
      fetchNotificationsStart(token);
    }
  }, [signInStart, connectSocket, fetchNotificationsStart, token]);

  const renderModals = () => {
    if (modal.modals.length > 0) {
      // Disable scrolling on the body while a modal is active
      document.querySelector("body").setAttribute("style", "overflow: hidden;");
      return modal.modals.map((modal, idx) => (
        <Modal key={idx} component={modal.component} {...modal.props} />
      ));
    } else {
      document.querySelector("body").setAttribute("style", "");
    }
  };

  const [transitions, api] = useTransition(alert?.showAlert, () => ({
    from: { opacity: 0, transform: "translateY(4rem)" },
    enter: { opacity: 1, transform: "translateY(0rem)" },
    leave: { opacity: 0, transform: "translateY(4rem)" },
    config: { tension: 500, friction: 50 },
  }));

  const renderApp = () => {
    // Wait for authentication
    if (!currentUser && token) {
      return <LoadingPage />;
    }
    return (
      <>
        {pathname !== "/login" && pathname !== "/signup" && <Header />}
        {renderModals()}
        {transitions &&
          transitions(({ item, key, props }) =>
            item ? (
              <animated.div key={key} style={props}>
                <Alert>{alert.text}</Alert>
              </animated.div>
            ) : null
          )}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/:username" element={<ProfilePage />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/settings" element={<SettingsPage />}>
              <Route path="edit" element={<EditProfileForm />} />
              <Route path="password" element={<ChangePasswordForm />} />
            </Route>
            <Route path="/explore" element={<ExplorePage />}>
              <Route path="" element={<SuggestedPosts />} />
              <Route path="tags/:hashtag" element={<HashtagPosts />} />
            </Route>
            <Route path="/new" element={<NewPostPage />} />
          </Route>
        </Routes>
        {pathname !== "/" && <Footer />}
        {pathname !== "/login" &&
          pathname !== "/signup" &&
          pathname !== "/new" &&
          currentUser && <MobileNav currentUser={currentUser} />}
      </>
    );
  };

  return (
    <div className="app" data-test="component-app">
      <Suspense fallback={<LoadingPage />}>{renderApp()}</Suspense>
    </div>
  );
}

const mapStateToProps = (state) => ({
  modal: state.modal,
  alert: state.alert,
  currentUser: selectCurrentUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  signInStart: (usernameOrEmail, password, token) =>
    dispatch(signInStart(usernameOrEmail, password, token)),
  connectSocket: () => dispatch(connectSocket()),
  fetchNotificationsStart: (authToken) =>
    dispatch(fetchNotificationsStart(authToken)),
});
export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
