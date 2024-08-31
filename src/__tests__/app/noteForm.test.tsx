import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import NoteForm from '@/app/noteForm';

const createMock = jest.fn();
jest.mock('aws-amplify/data', () => ({
      generateClient: jest.fn(() => ({
        models: {
          Note: {
            create: createMock
          }
        }
      }))
    }));

interface StorageManagerProps {
  onUploadSuccess: (result: { key?: string }) => void;
  path: (params: { identityId: string }) => string;
}

jest.mock('@aws-amplify/ui-react-storage', () => ({
  StorageManager: ({ onUploadSuccess, path }: StorageManagerProps) => {
    const simulateSuccess = () => {
      onUploadSuccess({ key: 'mockImageKey' });
    };

    expect(path).toBe('images/');

    return <button onClick={simulateSuccess}>Simulate Upload Success</button>;
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  render(<NoteForm />);
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

test('should require name and description', () => {
  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(createMock.mock.calls.length).toBe(0);
});

test('should require name when description provided', () => {
  const input = screen.getByTestId('note-description-field');
  fireEvent.change(input, {
    target: { value: 'test description' }
  });

  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(createMock.mock.calls.length).toBe(0);
});

test('should require description when name provided', () => {
  const input = screen.getByTestId('note-name-field');
  fireEvent.change(input, {
    target: { value: 'test name' }
  });

  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(createMock.mock.calls.length).toBe(0);
});

test('should add a new note when name and description are provided', () => {
  const nameInput = screen.getByTestId('note-name-field');
  fireEvent.change(nameInput, {
    target: { value: 'test name' }
  });

  const descriptionInput = screen.getByTestId('note-description-field');
  fireEvent.change(descriptionInput, {
    target: { value: 'test description' }
  });

  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(createMock.mock.calls.length).toBe(1);
});

test('should reset the form after a note is saved', () => {
  const nameInput = screen.getByTestId('note-name-field');
  fireEvent.change(nameInput, {
    target: { value: 'test name' }
  });

  const descriptionInput = screen.getByTestId('note-description-field');
  fireEvent.change(descriptionInput, {
    target: { value: 'test description' }
  });

  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(nameInput).toHaveValue('');
  expect(descriptionInput).toHaveValue('');
});

test('should update imageLocation state on file upload success', () => {
  const nameInput = screen.getByTestId('note-name-field');
  fireEvent.change(nameInput, {
    target: { value: 'test name' }
  });

  const descriptionInput = screen.getByTestId('note-description-field');
  fireEvent.change(descriptionInput, {
    target: { value: 'test description' }
  });

  fireEvent.click(screen.getByText('Simulate Upload Success'));

  expect(screen.getByTestId('hidden-image-location').value).toBe('mockImageKey');
});