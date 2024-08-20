import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "@/app/page";
import * as noteRepository from "@/app/noteRepository";

jest.mock('../../app/noteRepository');

const mockFindAll = noteRepository.findAll as jest.Mock;
const mockSave = noteRepository.save as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

test("fetchNotesCallback should load notes from localStorage", () => {
  const mockNotes = [{ name: 'Test Note', description: 'Test Description' }];
  mockFindAll.mockReturnValue(mockNotes);

  render(<App />);

  expect(screen.getByText("Test Note")).toBeInTheDocument();
});

test("createNote should add note and save it to localStorage", async () => {
  render(<App />);

  fireEvent.change(screen.getByTestId("note-name-field"), {
    target: { value: "New Note" },
  });
  fireEvent.change(screen.getByTestId("note-description-field"), {
    target: { value: "New Description" },
  });

  fireEvent.click(screen.getByTestId("note-form-submit"));

  expect(mockFindAll).toHaveBeenCalled();
  expect(mockSave).toHaveBeenCalledWith({ name: 'New Note', description: 'New Description' });
});
