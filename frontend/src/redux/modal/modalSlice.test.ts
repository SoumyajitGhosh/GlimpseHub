import { describe, it, expect } from "vitest";

import reducer, { showModal, hideModal } from "./modalSlice";

const initial = { modals: [] };

describe("modalSlice", () => {
  it("showModal pushes { props, component }", () => {
    const state = reducer(initial, showModal({ a: 1 }, "Comment/Comment"));
    expect(state.modals).toEqual([
      { props: { a: 1 }, component: "Comment/Comment" },
    ]);
  });

  it("hideModal removes the matching component and leaves others", () => {
    const state = {
      modals: [
        { props: {}, component: "Comment/Comment" },
        { props: {}, component: "Card/Card" },
      ],
    };
    expect(reducer(state, hideModal("Comment/Comment")).modals).toEqual([
      { props: {}, component: "Card/Card" },
    ]);
  });

  it("does not mutate the previous state", () => {
    const before = { modals: [] };
    reducer(before, showModal({}, "X/X"));
    expect(before.modals).toHaveLength(0);
  });
});
