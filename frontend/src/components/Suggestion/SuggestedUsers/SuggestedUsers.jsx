import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { showAlert } from '../../../redux/alert/alertActions';
import { selectToken } from '../../../redux/user/userSelectors';

import { getSuggestedUsers } from '../../../services/userService';

import UserCard from '../../UserCard/UserCard';
import UserListSkeleton from '../../UsersList/UsersListSkeleton/UsersListSkeleton';
import Card from '../../Card/Card';
import FollowButton from '../../Button/FollowButton/FollowButton';
import SuggestionCard from '../SuggestionCard/SuggestionCard';

const SuggestedUsers = ({ card, style, max }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  const [users, setUsers] = useState(null);

  useEffect(() => {
    (async function () {
      try {
        const response = await getSuggestedUsers(token, max);
        setUsers(response);
      } catch (err) {
        dispatch(showAlert(err.message));
      }
    })();
  }, [token, max, dispatch]);

  const renderUsers = () => {
    if (users) {
      return users.length > 0 ? (
        users.map((user, idx) => (
          <UserCard
            avatar={user.avatar}
            username={user.username}
            subText={user.fullName}
            style={card ? { padding: "1.5rem" } : { padding: "1rem 0" }}
            key={idx}
          >
            <FollowButton
              userId={user._id}
              username={user.username}
              following={false}
              avatar={user.avatar}
            />
          </UserCard>
        ))
      ) : (
        <h4 className="heading-4 color-grey font-medium">
          We currently can't find any users to suggest.
        </h4>
      );
    }

    return <UserListSkeleton amount={5} style={{ padding: "1.5rem" }} />;
  };

  return (
    <div className="suggested-users" style={style}>
      <Fragment>
        <div className="suggested-users__large">
          <h3 className="heading-3 mb-md">Suggestions for you</h3>
          {card ? <Card>{renderUsers()}</Card> : <div>{renderUsers()}</div>}
        </div>
        <div className="suggested-users__small">
          <div className="suggested-users__title">
            <h2 className="heading-2 font-thin">Welcome to GlimpseHub</h2>
            <h3 className="heading-3 font-medium color-grey">
              When you follow somebody you can see their photos here.
            </h3>
          </div>
          <div className="suggested-users__card-container">
            {users &&
              users.map((user, idx) => (
                <SuggestionCard
                  avatar={user.avatar}
                  username={user.username}
                  fullName={user.fullName}
                  posts={user.posts}
                  key={idx}
                >
                  <FollowButton
                    userId={user._id}
                    username={user.username}
                    following={false}
                    avatar={user.avatar}
                    style={{ width: "90%" }}
                  />
                </SuggestionCard>
              ))}
          </div>
        </div>
      </Fragment>
    </div>
  );
};

export default SuggestedUsers;
