import { defineFunction, defineStorage } from "@aws-amplify/backend";

jest.mock('@aws-amplify/backend', () => ({
  defineFunction: jest.fn(),
  defineStorage: jest.fn(),
}));

describe('Storage Definition', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should define storage with correct parameters', () => {
    (defineStorage as jest.Mock).mockReturnValue({});
    (defineFunction as jest.Mock).mockReturnValue(jest.fn());

    const { storage: definedStorage } = require('../../../../amplify/storage/resource');

    expect(defineStorage).toHaveBeenCalled();
    const storageCall = defineStorage.mock.calls[0][0];

    expect(storageCall.name).toBe('note-image');
    expect(storageCall.access).toBeDefined();
    expect(storageCall.triggers).toBeDefined();
    expect(storageCall.triggers.onDelete).toBeDefined();

    expect(defineFunction).toHaveBeenCalledWith({
      entry: './on-delete-handler.ts',
    });
  });
});