
import RootLayout from "@/app/layout";
import Home from "@/app/page";
import { render } from "@testing-library/react";

it("renders homepage unchanged", () => {
  jest.spyOn(console, 'error').mockImplementation(jest.fn());
  const { container } = render(<RootLayout><Home /></RootLayout>);
  expect(container).toMatchSnapshot();
});
