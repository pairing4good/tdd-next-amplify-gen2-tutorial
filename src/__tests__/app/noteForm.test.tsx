import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import NoteForm from '@/app/noteForm';
import { Note } from '@/app/types';

const mockSetFormDataCallback = jest.fn();
const mockSetNotesCallback = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  render(<NoteForm
      notes={[]}
      formData={{name: '', description: ''}}
      setFormDataCallback={mockSetFormDataCallback}
      setNotesCallback={mockSetNotesCallback}
    />);
});

test('should display a create note button', () => {
  const button = screen.getByTestId('note-form-submit');

  expect(button).toHaveTextContent('Create Note');
});

test('should display the name placeholder', () => {
  const input = screen.getByTestId('note-name-field');

  expect(input).toHaveAttribute('placeholder', 'Note Name');
});

test('should display the description placeholder', () => {
  const input = screen.getByTestId('note-description-field');

  expect(input).toHaveAttribute('placeholder', 'Note Description');
});

test('should call setFormDataCallback with the correct name value on input change', () => {
  const nameInput = screen.getByTestId('note-name-field');
  fireEvent.change(nameInput, { target: { value: 'New Note Name' } });
  expect(mockSetFormDataCallback).toHaveBeenCalledWith({
    name: 'New Note Name',
    description: '',
  });
});

test('should call setFormDataCallback with the correct description value on input change', () => {
  const descriptionInput = screen.getByTestId('note-description-field');
  fireEvent.change(descriptionInput, { target: { value: 'New Note Description' } });
  expect(mockSetFormDataCallback).toHaveBeenCalledWith({
    name: '',
    description: 'New Note Description',
  });
});

test('should call setNotesCallback with updated notes array when create note button is clicked', () => {
  cleanup();
  const formData: Note = { name: 'Note Name', description: 'Note Description' };
  const initialNotes: Note[] = [];
  
  render(<NoteForm
      notes={initialNotes}
      formData={formData}
      setFormDataCallback={mockSetFormDataCallback}
      setNotesCallback={mockSetNotesCallback}
    />);
  
  const button = screen.getByTestId('note-form-submit');
  fireEvent.click(button);

  expect(mockSetNotesCallback).toHaveBeenCalledWith([formData]);
});

test('should require name and description', () => {
  cleanup();
  const formData: Note = { name: '', description: '' };
  const initialNotes: Note[] = [];
  
  render(<NoteForm
      notes={initialNotes}
      formData={formData}
      setFormDataCallback={mockSetFormDataCallback}
      setNotesCallback={mockSetNotesCallback}
    />);

  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(mockSetNotesCallback.mock.calls.length).toBe(0);
});

test('should require name when description provided', () => {
  cleanup();
  const formData: Note = { name: '', description: 'test description' };
  const initialNotes: Note[] = [];
  
  render(<NoteForm
      notes={initialNotes}
      formData={formData}
      setFormDataCallback={mockSetFormDataCallback}
      setNotesCallback={mockSetNotesCallback}
    />);

  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(mockSetNotesCallback.mock.calls.length).toBe(0);
});

test('should require description when name provided', () => {
  cleanup();
  const formData: Note = { name: 'test name', description: '' };
  const initialNotes: Note[] = [];
  
  render(<NoteForm
      notes={initialNotes}
      formData={formData}
      setFormDataCallback={mockSetFormDataCallback}
      setNotesCallback={mockSetNotesCallback}
    />);

  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(mockSetNotesCallback.mock.calls.length).toBe(0);
});

test('should add a new note when name and description are provided', () => {
  cleanup();
  const formData: Note = { name: 'test name', description: 'test description' };
  const initialNotes: Note[] = [];
  
  render(<NoteForm
      notes={initialNotes}
      formData={formData}
      setFormDataCallback={mockSetFormDataCallback}
      setNotesCallback={mockSetNotesCallback}
    />);

  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(mockSetNotesCallback.mock.calls.length).toBe(1);
});

test('should reset the form after a note is saved', () => {
  cleanup();
  const formData: Note = { name: 'test name', description: 'test description' };
  const initialNotes: Note[] = [];
  
  render(<NoteForm
    notes={initialNotes}
    formData={formData}
    setFormDataCallback={mockSetFormDataCallback}
    setNotesCallback={mockSetNotesCallback}
  />);

  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(mockSetFormDataCallback).toHaveBeenCalledWith({
    name: '',
    description: ''
  });
});