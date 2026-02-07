import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  it("renders the headline", () => {
    render(<Home />);
    expect(
      screen.getByText(
        /Navigate repositories, ship updates, and keep your team aligned\./i
      )
    ).toBeInTheDocument();
  });
});
