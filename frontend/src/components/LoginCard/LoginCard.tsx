import type { FormEvent } from "react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Link } from "react-router-dom";

import {
  signInStart,
  selectError,
  selectFetching,
  selectCurrentUser,
} from "../../redux/user/userSlice";

import Button from "../Button/Button";
import FormInput from "../FormInput/FormInput";
import Divider from "../Divider/Divider";
import TextButton from "../Button/TextButton/TextButton";
import Card from "../Card/Card";

interface LoginCardProps {
  onClick?: () => void;
  modal?: boolean;
}

const LoginCard = ({ onClick, modal }: LoginCardProps) => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectError);
  const fetching = useAppSelector(selectFetching);
  const currentUser = useAppSelector(selectCurrentUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(signInStart(email, password));
  };

  // Navigate away if user is already logged in
  useEffect(() => {
    if (currentUser && onClick) {
      onClick();
    }
  }, [currentUser, onClick]);

  return (
    <div
      className="login-card-container"
      style={
        modal
          ? {
              padding: "2rem",
            }
          : {}
      }
    >
      <Card className="form-card">
        <h1 className="heading-logo text-center">GlimpseHub</h1>
        <form onSubmit={handleSubmit} className="form-card__form">
          <FormInput
            placeholder="Username or email address"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormInput
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button disabled={fetching} loading={fetching}>
            Log In
          </Button>
        </form>
        <Divider>OR</Divider>
        {error && (
          <p style={{ padding: "1rem 0" }} className="error">
            {error}
          </p>
        )}
        <TextButton style={{ marginTop: "1.5rem" }} darkBlue small>
          Forgot password?
        </TextButton>
      </Card>
      <Card>
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          <h4 style={{ marginRight: "5px" }} className="heading-4 font-thin">
            Don&apos;t have an account?
          </h4>
          <Link to="/signup" onClick={() => onClick && onClick()}>
            <TextButton medium blue bold>
              Sign up
            </TextButton>
          </Link>
        </section>
      </Card>
    </div>
  );
};

export default LoginCard;
