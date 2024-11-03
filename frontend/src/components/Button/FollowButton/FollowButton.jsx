import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import {
    selectCurrentUser,
    selectToken,
} from '../../../redux/user/userSelectors';
import { showModal } from '../../../redux/modal/modalActions';
import { showAlert } from '../../../redux/alert/alertActions';

import { followUser } from '../../../services/profileService';

import Button from '../Button';
import UnfollowPrompt from '../../UnfollowPrompt/UnfollowPrompt';
import { fetchProfileAction } from "../../../redux/profilePage/profilePageActions";

const FollowButton = ({ userId, following, username, avatar, style }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const token = useSelector(selectToken);

  const [isFollowing, setIsFollowing] = useState(following);
  const [loading, setLoading] = useState(false);

  const follow = async () => {
    try {
      setLoading(true);
      await followUser(userId, token);
      setIsFollowing(!isFollowing);
      setLoading(false);
      dispatch(fetchProfileAction(currentUser.username, token));
    } catch (err) {
      setLoading(false);
      dispatch(showAlert("Could not follow the user.", () => follow()));
    }
  };

  if (username === currentUser.username) {
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
