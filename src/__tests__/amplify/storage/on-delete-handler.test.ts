import { handler } from '../../../../amplify/storage/on-delete-handler';

describe('S3 Lambda Handler', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should log the correct object keys from the S3 event', async () => {
    const event = {
      Records: [
        {
          s3: {
            object: {
              key: 'file1.txt',
            },
          },
        },
        {
          s3: {
            object: {
              key: 'file2.txt',
            },
          },
        },
      ],
    };

    await handler(event);

    expect(console.log).toHaveBeenCalledWith('Deleted [file1.txt, file2.txt]');
  });
});