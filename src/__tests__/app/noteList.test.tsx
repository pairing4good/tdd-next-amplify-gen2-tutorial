import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import NoteList from '@/app/noteList';
import { generateClient } from 'aws-amplify/data';
import { remove } from 'aws-amplify/storage';

jest.mock('aws-amplify/data', () => ({
  generateClient: jest.fn(),
}));

jest.mock('aws-amplify/storage', () => ({
  remove: jest.fn(),
}));

const mockSubscribe = jest.fn();
const deleteMock = jest.fn().mockResolvedValue({data: {imageLocation: 'testImageLocation'}});

const mockClient = {
  models: {
    Note: {
      observeQuery: jest.fn(() => ({
        subscribe: mockSubscribe,
      })),
      delete: deleteMock
    },
  },
};

beforeEach(() => {
  generateClient.mockReturnValue(mockClient);
  mockSubscribe.mockClear();
  deleteMock.mockClear();
  remove.mockClear();
});

test('should call subscribe and handle data updates', () => {
  jest.spyOn(console, 'error').mockImplementation(jest.fn());
  
  const testItems = [
    { id: '1', name: 'Test Note 1', description: 'Description 1' },
    { id: '2', name: 'Test Note 2', description: 'Description 2' },
  ];

  mockSubscribe.mockImplementation(({ next }) => {
    next({ items: testItems });
    return { unsubscribe: jest.fn() };
  });

  render(<NoteList />);

  expect(mockSubscribe).toHaveBeenCalled();

  const subscribeCallback = mockSubscribe.mock.calls[0][0];
  expect(subscribeCallback).toHaveProperty('next');
  
  subscribeCallback.next({ items: testItems });

  expect(screen.getByTestId('test-name-0')).toHaveTextContent('Test Note 1');
  expect(screen.getByTestId('test-description-0')).toHaveTextContent('Description 1');
  expect(screen.getByTestId('test-name-1')).toHaveTextContent('Test Note 2');
  expect(screen.getByTestId('test-description-1')).toHaveTextContent('Description 2');
});

it('should unsubscribe on unmount', () => {
  const mockUnsubscribe = jest.fn();
  
  mockSubscribe.mockImplementation(() => {
    return { unsubscribe: mockUnsubscribe }; 
  });

  const { unmount } = render(<NoteList />);
  unmount();

  expect(mockUnsubscribe).toHaveBeenCalled();
});

test('should delete a note', async () => {
  jest.spyOn(console, 'error').mockImplementation(jest.fn());
  
  const testId = '1';
  const testItems = [
    { id: testId, name: 'Test Note 1', description: 'Description 1' },
  ];

  mockSubscribe.mockImplementation(({ next }) => {
    next({ items: testItems });
    return { unsubscribe: jest.fn() };
  });

  render(<NoteList />);

  expect(mockSubscribe).toHaveBeenCalled();

  const subscribeCallback = mockSubscribe.mock.calls[0][0];
  expect(subscribeCallback).toHaveProperty('next');
  
  subscribeCallback.next({ items: testItems });

  expect(screen.getByTestId('test-name-0')).toHaveTextContent('Test Note 1');
  expect(screen.getByTestId('test-description-0')).toHaveTextContent('Description 1');

  const button = screen.getByTestId('test-delete-button-0');

  fireEvent.click(button);

  await waitFor(() => {
    expect(deleteMock).toHaveBeenCalledWith({"id": testId})
    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith({ path: 'testImageLocation' });
  });
});

test('should not call remove when no image location provided', async () => {
  jest.spyOn(console, 'error').mockImplementation(jest.fn());
  
  const testId = '1';
  const testItems = [
    { id: testId, name: 'Test Note 1', description: 'Description 1' },
  ];

  deleteMock.mockResolvedValue({ data: {} });

  mockSubscribe.mockImplementation(({ next }) => {
    next({ items: testItems });
    return { unsubscribe: jest.fn() };
  });

  render(<NoteList />);

  expect(mockSubscribe).toHaveBeenCalled();

  const subscribeCallback = mockSubscribe.mock.calls[0][0];
  expect(subscribeCallback).toHaveProperty('next');
  
  subscribeCallback.next({ items: testItems });

  expect(screen.getByTestId('test-name-0')).toHaveTextContent('Test Note 1');
  expect(screen.getByTestId('test-description-0')).toHaveTextContent('Description 1');

  const button = screen.getByTestId('test-delete-button-0');

  fireEvent.click(button);

  await waitFor(() => {
    expect(deleteMock).toHaveBeenCalledWith({"id": testId})
    expect(remove).toHaveBeenCalledTimes(0);
  });
});

test('should not call remove when delete function fails', async () => {
  jest.spyOn(console, 'error').mockImplementation(jest.fn());
  
  const testId = '1';
  const testItems = [
    { id: testId, name: 'Test Note 1', description: 'Description 1' },
  ];

  deleteMock.mockRejectedValueOnce(new Error('Delete failed'));

  mockSubscribe.mockImplementation(({ next }) => {
    next({ items: testItems });
    return { unsubscribe: jest.fn() };
  });

  render(<NoteList />);

  expect(mockSubscribe).toHaveBeenCalled();

  const subscribeCallback = mockSubscribe.mock.calls[0][0];
  expect(subscribeCallback).toHaveProperty('next');
  
  subscribeCallback.next({ items: testItems });

  expect(screen.getByTestId('test-name-0')).toHaveTextContent('Test Note 1');
  expect(screen.getByTestId('test-description-0')).toHaveTextContent('Description 1');

  const button = screen.getByTestId('test-delete-button-0');

  fireEvent.click(button);

  await waitFor(() => {
    expect(deleteMock).toHaveBeenCalledWith({"id": testId})
    expect(remove).not.toHaveBeenCalledWith({ path: 'testImageLocation' });
    expect(console.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error deleting note:', expect.any(Error));
    console.error.mockRestore();
  });
});
