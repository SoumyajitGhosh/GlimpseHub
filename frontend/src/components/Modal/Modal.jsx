import React, { useEffect, memo, lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import { hideModal } from "../../redux/modal/modalActions";

// Mapping object for dynamically importing components with paths
const componentMap = {
  "OptionsDialog/OptionsDialog": () =>
    import("../../components/OptionsDialog/OptionsDialog"),
  "ChangePasswordForm/ChangePasswordForm": () =>
    import("../../components/ChangePasswordForm/ChangePasswordForm"),
  "Alert/Alert": () => import("../../components/Alert/Alert"),
  "Avatar/Avatar": () => import("../../components/Avatar/Avatar"),
  "Button/Button": () => import("../../components/Button/Button"),
  "Card/Card": () => import("../../components/Card/Card"),
  "ChangeAvatarButton/ChangeAvatarButton": () =>
    import("../../components/ChangeAvatarButton/ChangeAvatarButton"),
  "Comment/Comment": () => import("../../components/Comment/Comment"),
  "Divider/Divider": () => import("../../components/Divider/Divider"),
  "EditProfileForm/EditProfileForm": () =>
    import("../../components/EditProfileForm/EditProfileForm"),
  "Feed/Feed": () => import("../../components/Feed/Feed"),
  "FilterSelector/FilterSelector": () =>
    import("../../components/FilterSelector/FilterSelector"),
  "Footer/Footer": () => import("../../components/Footer/Footer"),
  "FormInput/FormInput": () => import("../../components/FormInput/FormInput"),
  "FormTextarea/FormTextarea": () =>
    import("../../components/FormTextarea/FormTextarea"),
  "HashtagPosts/HashtagPosts": () =>
    import("../../components/HashtagPosts/HashtagPosts"),
  "Header/Header": () => import("../../components/Header/Header"),
  "Icon/Icon": () => import("../../components/Icon/Icon"),
  "ImageGrid/ImageGrid": () => import("../../components/ImageGrid/ImageGrid"),
  "Loader/Loader": () => import("../../components/Loader/Loader"),
  "LoginCard/LoginCard": () => import("../../components/LoginCard/LoginCard"),
  "MobileNav/MobileNav": () => import("../../components/MobileNav/MobileNav"),
  "NewPost/NewPost": () => import("../../components/NewPost/NewPost"),
  "Notification/NotificationButton/NotificationButton": () =>
    import(
      "../../components/Notification/NotificationButton/NotificationButton"
    ),
  "Notification/NotificationFeed/NotificationFeed": () =>
    import("../../components/Notification/NotificationFeed/NotificationFeed"),
  "PopupCard/PopupCard": () => import("../../components/PopupCard/PopupCard"),
  "PostDialog/PostDialog": () =>
    import("../../components/PostDialog/PostDialog"),
  "PreviewImage/PreviewImage": () =>
    import("../../components/PreviewImage/PreviewImage"),
  "ProfileCategory/ProfileCategory": () =>
    import("../../components/ProfileCategory/ProfileCategory"),
  "ProtectedRoute/ProtectedRoute": () =>
    import("../../components/ProtectedRoute/ProtectedRoute"),
  "SearchBox/SearchBox": () => import("../../components/SearchBox/SearchBox"),
  "SearchSuggestion/SearchSuggestion": () =>
    import("../../components/SearchSuggestion/SearchSuggestion"),
  "SettingsForm/SettingsForm": () =>
    import("../../components/SettingsForm/SettingsForm"),
  "SetttingsButton/SettingsButton": () =>
    import("../../components/SetttingsButton/SettingsButton"),
  "SignUpCard/SignUpCard": () =>
    import("../../components/SignUpCard/SignUpCard"),
  "SkeletonLoader/SkeletonLoader": () =>
    import("../../components/SkeletonLoader/SkeletonLoader"),
  "SuggestedPosts/SuggestedPosts": () =>
    import("../../components/SuggestedPosts/SuggestedPosts"),
  "Suggestion/SuggestedUsers/SuggestedUsers": () =>
    import("../../components/Suggestion/SuggestedUsers/SuggestedUsers"),
  "Suggestion/SuggestionCard/SuggestionCard": () =>
    import("../../components/Suggestion/SuggestionCard/SuggestionCard"),
  "UnfollowPrompt/UnfollowPrompt": () =>
    import("../../components/UnfollowPrompt/UnfollowPrompt"),
  "UserCard/UserCard": () => import("../../components/UserCard/UserCard"),
  "UsersList/UsersList": () => import("../../components/UsersList/UsersList"),
};

const Modal = memo(({ component, ...additionalProps }) => {
  const dispatch = useDispatch();
  const modalRoot = document.querySelector("#modal-root");
  const el = document.createElement("div");
  el.className = "modal grid";

  // Get the LazyComponent based on the component prop
  const LazyComponent = componentMap[component]
    ? lazy(componentMap[component])
    : null;

  useEffect(() => {
    const hide = ({ target }) => {
      if (target === el || !el.contains(target)) {
        dispatch(hideModal(component));
      }
    };
    el.addEventListener("mousedown", hide, false);
    modalRoot.appendChild(el);

    return () => {
      el.removeEventListener("mousedown", hide, false);
      modalRoot.removeChild(el);
    };
  }, [el, modalRoot, dispatch, component]);

  return ReactDOM.createPortal(
    <Suspense fallback={<div>Loading...</div>}>
      {LazyComponent ? (
        <LazyComponent
          hide={() => dispatch(hideModal(component))}
          {...additionalProps}
        />
      ) : (
        <div>Component "{component}" not found.</div>
      )}
    </Suspense>,
    el
  );
});

Modal.propTypes = {
  component: PropTypes.string.isRequired,
  props: PropTypes.object,
};

export default Modal;
