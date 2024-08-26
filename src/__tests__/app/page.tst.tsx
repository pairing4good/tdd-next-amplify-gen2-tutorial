import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "@/app/page";

jest.mock('aws-amplify/data', () => ({
      generateClient: jest.fn(() => ({
        models: {
          Note: {
            observeQuery: jest.fn(() => ({
              subscribe: () => {
                return {
                  unsubscribe: jest.fn(),
                  next: jest.fn(),
                }
              },
            })),
            create: jest.fn()
          }
        }
      }))
    }));

beforeEach(() => {
  jest.clearAllMocks();
});

test("should render children", () => {
  render(<App />);

  expect(screen.getByTestId("note-form")).toBeInTheDocument();
  expect(screen.getByTestId("note-list")).toBeInTheDocument();
});