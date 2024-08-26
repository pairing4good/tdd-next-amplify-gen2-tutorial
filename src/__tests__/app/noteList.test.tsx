import React from 'react';
import { render, screen } from '@testing-library/react';
import NoteList from '@/app/noteList';
import { generateClient } from 'aws-amplify/data';

jest.mock('aws-amplify/data', () => ({
  generateClient: jest.fn(),
}));

const mockSubscribe = jest.fn();
const mockClient = {
  models: {
    Note: {
      observeQuery: jest.fn(() => ({
        subscribe: mockSubscribe,
      })),
    },
  },
};

beforeEach(() => {
  generateClient.mockReturnValue(mockClient);
  mockSubscribe.mockClear();
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