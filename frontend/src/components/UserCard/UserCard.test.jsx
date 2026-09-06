import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import { storeFactory } from "../../utils/test/storeFactory";
import UserCard from "./UserCard";

const renderUserCard = (props) => {
  const store = storeFactory();
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <UserCard username="jdoe" avatar="/avatar.png" {...props} />
      </MemoryRouter>
    </Provider>
  );
};

describe("UserCard", () => {
  it("renders the username as a link to the profile", () => {
    renderUserCard();
    const link = screen.getByRole("link", { name: "jdoe" });
    expect(link).toHaveAttribute("href", "/jdoe");
  });

  it("links to a custom destination when linkTo is provided", () => {
    renderUserCard({ linkTo: "/custom-path" });
    const [link] = screen.getAllByRole("link");
    expect(link).toHaveAttribute("href", "/custom-path");
  });

  it("renders subText when provided", () => {
    renderUserCard({ subText: "Followed by 3 people" });
    expect(screen.getByText("Followed by 3 people")).toBeInTheDocument();
  });
});
