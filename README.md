# TDD AWS Amplify Next App - Step 18

## Delete Note Image Logging
Image deletion happens behind the scenes.  Since storage costs money we want to track when images are deleted.

### Why: User Story

```
As the application owner
I track when note images are deleted
So that I can monitor my storage usage
```

### What: User Acceptance Criteria

```
Given that a note with an image is deleted
When the note image is deleted
Then log that the image was deleted
```

```
Given that a note without an image is deleted
When no image is deleted
Then nothing is logged
```

Up til now we have written high-level [Cypress](https://www.cypress.io/) tests that start up the entire app and run it like a user would.  We have also written lower-level tests using the [render](https://testing-library.com/docs/react-testing-library/api#render) function  from the [React Testing Library](https://testing-library.com/).  The `render` function uses [React](https://react.dev/) to render a component.  This partial rendering of the app can be quite complex and can often be difficult to easily test.  In this step we will write tests at the bottom of the [Testing Pyramid](https://martinfowler.com/bliki/TestPyramid.html) called which are often called [unit tests](https://martinfowler.com/bliki/UnitTest.html).  These tests verify a single method in complete isolation.  No outside frameworks, like React, are needed to create the correct outcome for unit tests.  Instead, unit tests simply run a single function with a set of inputs and verify the outputs.  For functions that have [side effects](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) the use of [mocks](https://en.wikipedia.org/wiki/Mock_object) allow the test to determine if the function produced the correct outcome(s).  These unit tests are the fastest to run and easiest to maintain.  As a result should work to write as many as we can.  In the next lesson we will learn how to extract reusable logic out of components so that they can be independently unit tested.

In this code we will use an [AWS Lambda](https://aws.amazon.com/lambda/) serverless function that is triggered when a file is deleted from [S3](https://aws.amazon.com/s3/).  This [S3 Upload confirmation](https://docs.amplify.aws/javascript/build-a-backend/functions/examples/s3-upload-confirmation/) example shows what our production code will look like with one exception.  This example is logging when a file is uploaded instead of when a file is deleted.  Instead of defining a function for the `onUpload` trigger we will be using the `onDelete` trigger instead.  Otherwise the production code will be the same as the example.

Let's test drive this Lambda function.  First let's create a test that will drive the creation of `amplify/storage/resource.ts`.

- Create a new test `src/__tests__/amplify/storage/resource.test.ts` with the following content

```js
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
```

-  The test fails because to `triggers` have been defined in the `amplify/storage/resource.ts` file.
-  Add the following code to resolve this issue.

```js
import { defineFunction, defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "note-image",
  access: (allow) => ({
    "images/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
  triggers: {
    onDelete: defineFunction({
      entry: './on-delete-handler.ts'
    })
  }
});
```

- This first test is green.  Now let's add a test that drives the creation of the `on-delete-handler`
- Create a new test `src/__tests__/amplify/storage/on-delete-handler.test.ts` with the following content

```js
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
```

- The test cannot find the module `../../../../amplify/storage/on-delete-handler`
- Create the `amplify/storage/on-delete-handler.ts` file with the following content

```js
export const handler = () => {};
```

- Now we have a test that is failing for the right reasons.  Now let's add the following code to the `on-delete-handler`

```js
import type { S3Handler } from 'aws-lambda';

export const handler: S3Handler = async (event) => {
  const objectKeys = event.Records.map((record) => record.s3.object.key);
  console.log(`Deleted [${objectKeys.join(', ')}]`);
};
```

- Run all the tests

- Green

- Commit

Demonstrate this to the customer. If they accept this story then move it to Done.


[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/017-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/019-step)
