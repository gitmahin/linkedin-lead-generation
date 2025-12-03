import { Button, buttonVariants } from "../button";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

afterEach(() => {
  cleanup();
});

describe("Shadcn Button Component", () => {
  test("Rendering Button", () => {
    render(<Button data-testid="button">Click</Button>);
    const button = screen.getByTestId("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-primary");
  });

  test("Button should have text", () => {
    render(<Button data-testid="button">Click</Button>);
    const button = screen.getByTestId("button");
    expect(button).toHaveTextContent("Click");
  });

  test("Button should call the click handler", () => {
    const handleClick = jest.fn();
    render(
      <Button data-testid="button" onClick={handleClick}>
        Click
      </Button>
    );
    const button = screen.getByTestId("button");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  describe("Getting button variants", () => {
    const variants: [string, string][] = [
      ["default", "bg-primary"],
      ["destructive", "bg-destructive"],
      ["outline", "border"],
      ["secondary", "bg-secondary"],
      ["ghost", "hover:bg-accent"],
      ["link", "text-primary"],
    ];

    test.each(variants)(
      "Button variant '%s' should have class '%s'",
      (variant, className) => {
        render(
          <Button
            data-testid="button"
            variant={variant as keyof typeof buttonVariants}
          >
            Click
          </Button>
        );
        const button = screen.getByTestId("button");
        expect(button).toHaveClass(className);
      }
    );
  });
});
