import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "@/app/page";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();

beforeEach(() => {
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    configurable: true,
  });
  localStorage.clear();
});

test("fetchNotesCallback should load notes from localStorage", () => {
  const notes = [{ name: "Test Note", description: "This is a test note." }];
  localStorage.setItem("notes", JSON.stringify(notes));

  render(<App />);

  expect(screen.getByText("Test Note")).toBeInTheDocument();
});

test("createNote should add note and save it to localStorage", () => {
  render(<App />);

  fireEvent.change(screen.getByTestId("note-name-field"), {
    target: { value: "New Note" },
  });
  fireEvent.change(screen.getByTestId("note-description-field"), {
    target: { value: "New Description" },
  });

  fireEvent.click(screen.getByTestId("note-form-submit"));

  expect(screen.getByText("New Note")).toBeInTheDocument();

  const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
  expect(savedNotes).toEqual([
    { name: "New Note", description: "New Description" },
  ]);
});
