# TDD AWS Amplify Next App - Step 9

## Refactor To Repository

The `App` component now has two concerns. React [state management](https://en.wikipedia.org/wiki/State_management) and [persistence](<https://en.wikipedia.org/wiki/Persistence_(computer_science)>). [State management](https://en.wikipedia.org/wiki/State_management) is concerned with frontend values, where [persistence](<https://en.wikipedia.org/wiki/Persistence_(computer_science)>) is a backend concern. Persistence and data access concerns are often extracted into a [repository](https://makingloops.com/why-should-you-use-the-repository-pattern).

- Create a `noteRepository.ts` file in the `src/app` directory.
- Move all the `localStorage` calls to this new file.

```js
import { Note } from "./types";

export function findAll(): Note[] {
    const savedNotesString = localStorage.getItem("notes");
    return savedNotesString ? JSON.parse(savedNotesString) : [];
}

export function save(note : Note) {
  const notes = findAll();
  localStorage.setItem('notes', JSON.stringify([...notes, note]));
}
```

- Update `page.tsx` to use the new `NoteRepository` functions

```js
import { findAll, save } from "./noteRepository";
...
  const fetchNotesCallback = () => {
    return setNotes(findAll());
  };

  const createNote = () => {
    save(formData);
    const notes = findAll();
    setNotes(notes);
  };
```

- Run all of the tests.
- Green
- Commit

Now let's add a [jest](https://jestjs.io/) unit test for the `noteRepository`
- Create a `noteRepository.test.tsx` test in the `src/__tests__/app` folder

```js
import { findAll, save } from "@/app/noteRepository";
import { Note } from "@/app/types";


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

  localStorageMock.clear();
});

describe('Note Storage', () => {
  describe('findAll', () => {
    it('should return an empty array if no notes are saved', () => {
      expect(findAll()).toEqual([]);
    });

    it('should return an array of notes if notes are saved', () => {
      const note: Note = { name: 'Test Note', description: 'This is a test note.' };
      localStorage.setItem('notes', JSON.stringify([note]));

      expect(findAll()).toEqual([note]);
    });
  });

  describe('save', () => {
    it('should save a new note to localStorage', () => {
      const note: Note = { name: 'New Note', description: 'This is a new note.' };

      save(note);

      expect(findAll()).toEqual([note]);
    });

    it('should append a new note to existing notes', () => {
      const note1: Note = { name: 'Note 1', description: 'First note.' };
      const note2: Note = { name: 'Note 2', description: 'Second note.' };

      localStorage.setItem('notes', JSON.stringify([note1]));

      save(note2);

      expect(findAll()).toEqual([note1, note2]);
    });

    it('should handle saving an empty note', () => {
      const note: Note = { name: '', description: '' };

      save(note);

      expect(findAll()).toEqual([note]);
    });
  });
});
```

Now that the `noteRepository` [encapsulates](https://en.wikipedia.org/wiki/Encapsulation_(computer_programming)) all of the calls to `localStorage`, the `page.tst.tsx` can mock out the `noteRepository` instead of the `localStorage`.

```js
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
```

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/009-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/011-step)
