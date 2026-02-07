import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./page";

const seedData = {
  version: "1",
  navs: [
    {
      name: "Alpha",
      url: "https://alpha.example.com",
      icon: "https://alpha.example.com/favicon.ico",
      localRepoPath: "/Users/test/alpha",
      tags: ["one", "two"],
      description: "Alpha repo",
    },
  ],
};

beforeEach(() => {
  localStorage.setItem("repo_nav_data", JSON.stringify(seedData));
});

afterEach(() => {
  localStorage.clear();
});

describe("Home page", () => {
  it("renders the headline", () => {
    render(<Home />);
    expect(
      screen.getByText(/Manage your navigation links/i)
    ).toBeInTheDocument();
  });

  it("edits a navigation item", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await screen.findByText("Alpha");

    await user.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.click(screen.getByText("Alpha"));

    await screen.findByText("Edit");

    const nameInput = screen.getByLabelText(/Name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "Beta");

    await user.click(screen.getByRole("button", { name: "Update" }));

    await waitFor(() => {
      expect(screen.getByText("Beta")).toBeInTheDocument();
    });
  });

  it("deletes a navigation item", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await screen.findByText("Alpha");

    await user.click(screen.getByRole("button", { name: "Delete" }));
    fireEvent.click(screen.getByText("Alpha"));

    await screen.findByText(/Delete Navigation Item\?/i);
    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
    });
  });
});
