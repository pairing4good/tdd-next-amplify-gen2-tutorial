import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Note } from '@/app/types';
import NoteList from '@/app/noteList';

test('should display multiple notes when more than one notes is provided', () => {
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

test('should display nothing when no notes are provided', () => {
  render(<NoteList notes={[]} />);
  const firstNoteName = screen.queryByTestId('test-name-0');

  expect(firstNoteName).toBeNull();
});

test('should display one note when one notes is provided', () => {
  const note = { name: 'test name', description: 'test description' };
  render(<NoteList notes={[note]} />);

  const firstNoteName = screen.queryByTestId('test-name-0');
  expect(firstNoteName).toHaveTextContent('test name');

  const firstNoteDescription = screen.queryByTestId('test-description-0');
  expect(firstNoteDescription).toHaveTextContent('test description');
});

test('should throw an exception the note array is undefined', () => {
  expect(() => {
    render(<NoteList notes={undefined}/>);
  }).toThrow();
});