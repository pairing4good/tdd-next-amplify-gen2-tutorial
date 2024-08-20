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
