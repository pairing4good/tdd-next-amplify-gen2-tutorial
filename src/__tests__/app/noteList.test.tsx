import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Note } from '@/app/types';
import NoteList from '@/app/noteList';

test('should display notes correctly', () => {
  const notes: Note[] = [
    { name: 'First Note', description: 'First Description' },
    { name: 'Second Note', description: 'Second Description' }
  ];

  render(<NoteList notes={notes} />);

  notes.forEach((note, index) => {
    expect(screen.getByTestId(`test-name-${index}`)).toHaveTextContent(note.name);
    expect(screen.getByTestId(`test-description-${index}`)).toHaveTextContent(note.description);
  });
});