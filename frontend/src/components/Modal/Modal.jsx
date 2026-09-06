import { useEffect, useRef, memo, lazy, Suspense } from "react";
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
  "SettingsButton/SettingsButton": () =>
    import("../../components/SettingsButton/SettingsButton"),
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

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const Modal = memo(({ component, ...additionalProps }) => {
  const dispatch = useDispatch();
  const modalRoot = document.querySelector("#modal-root");
  const el = document.createElement("div");
  el.className = "modal grid";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.tabIndex = -1;

  const previouslyFocusedRef = useRef(null);

  // Get the LazyComponent based on the component prop
  const LazyComponent = componentMap[component]
    ? lazy(componentMap[component])
    : null;

  useEffect(() => {
    // Reused by both outside-click and Escape-key dismissal so there's a
    // single source of truth for "how does this modal get dismissed".
    const dismiss = () => dispatch(hideModal(component));

    const handleMouseDown = ({ target }) => {
      if (target === el || !el.contains(target)) {
        dismiss();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        dismiss();
        return;
      }

      if (event.key === "Tab") {
        const focusable = Array.from(
          el.querySelectorAll(FOCUSABLE_SELECTOR)
        );
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    el.addEventListener("mousedown", handleMouseDown, false);
    document.addEventListener("keydown", handleKeyDown);
    modalRoot.appendChild(el);

    previouslyFocusedRef.current = document.activeElement;
    // Move focus into the modal: first focusable element, falling back to
    // the modal container itself (it has tabIndex={-1} via el.tabIndex above).
    const focusable = el.querySelectorAll(FOCUSABLE_SELECTOR);
    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      el.focus();
    }

    return () => {
      el.removeEventListener("mousedown", handleMouseDown, false);
      document.removeEventListener("keydown", handleKeyDown);
      modalRoot.removeChild(el);

      const previouslyFocused = previouslyFocusedRef.current;
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
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
