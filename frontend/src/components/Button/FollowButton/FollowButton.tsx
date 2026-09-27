import { useState } from "react";
import type { CSSProperties } from "react";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectCurrentUser, selectToken } from "../../../redux/user/userSlice";
import { showModal } from "../../../redux/modal/modalSlice";
import { showAlert } from "../../../redux/alert/alertSlice";

import { followUser } from "../../../services/profileService";

import Button from "../Button";
import UnfollowPrompt from "../../UnfollowPrompt/UnfollowPrompt";
import { fetchProfileAction } from "../../../redux/profilePage/profilePageSlice";

interface FollowButtonProps {
  userId: string;
  following?: boolean;
  username: string;
  avatar?: string;
  style?: CSSProperties;
}

const FollowButton = ({
  userId,
  following,
  username,
  avatar,
  style,
}: FollowButtonProps) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectToken);

  const [isFollowing, setIsFollowing] = useState(following);
  const [loading, setLoading] = useState(false);

  const follow = async () => {
    try {
      setLoading(true);
      await followUser(userId, token ?? "");
      setIsFollowing(!isFollowing);
      setLoading(false);
      if (currentUser) {
        dispatch(fetchProfileAction(currentUser.username, token));
      }
    } catch {
      setLoading(false);
      dispatch(showAlert("Could not follow the user.", () => follow()));
    }
  };

  if (username === currentUser?.username) {
    return <Button disabled>Follow</Button>;
  }

  if (isFollowing) {
    return (
      <Button
        style={style}
        loading={loading}
        onClick={() =>
          dispatch(
            showModal(
              {
                options: [
                  {
                    warning: true,
                    text: "Unfollow",
                    onClick: () => follow(),
                  },
                ],
                children: (
                  <UnfollowPrompt avatar={avatar} username={username} />
                ),
              },
              "OptionsDialog/OptionsDialog"
            )
          )
        }
        inverted
      >
        Following
      </Button>
    );
  }

  return (
    <Button style={style} loading={loading} onClick={() => follow()}>
      Follow
    </Button>
  );
};

export default FollowButton;
