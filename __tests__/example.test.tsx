import { render, screen } from "@testing-library/react";

describe("Example Test Suite", () => {
  describe("Basic JavaScript Tests", () => {
    it("should perform basic arithmetic", () => {
      expect(1 + 1).toBe(2);
    });

    it("should handle string operations", () => {
      expect("hello" + " " + "world").toBe("hello world");
    });
  });

  describe("React Component Tests", () => {
    function SimpleComponent() {
      return (
        <div>
          <h1>Test Component</h1>
          <p>This is a test component to verify Jest configuration.</p>
        </div>
      );
    }

    it("should render a simple React component", () => {
      render(<SimpleComponent />);
      expect(screen.getByText("Test Component")).toBeInTheDocument();
    });

    it("should find elements by text content", () => {
      render(<SimpleComponent />);
      expect(
        screen.getByText("This is a test component to verify Jest configuration.")
      ).toBeInTheDocument();
    });
  });

  describe("Jest Configuration Verification", () => {
    it("should have access to testing-library matchers", () => {
      const element = document.createElement("div");
      element.textContent = "Hello";
      document.body.appendChild(element);
      expect(element).toBeInTheDocument();
      document.body.removeChild(element);
    });

    it("should support modern JavaScript features", () => {
      const arr = [1, 2, 3];
      const doubled = arr.map((x) => x * 2);
      expect(doubled).toEqual([2, 4, 6]);
    });

    it("should support async/await", async () => {
      const promise = Promise.resolve("success");
      const result = await promise;
      expect(result).toBe("success");
    });
  });
});
