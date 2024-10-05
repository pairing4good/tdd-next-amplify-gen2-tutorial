# TDD AWS Amplify Next App - Step 17

## Delete Note Image
Right now when a note that contains an image is deleted the image is not deleted.  To fix this we created the `Delete Note Image`.  Be sure to move it into `In Progress` once you start working on it.

### Why: User Story

```
As the application owner
I want to clean up note images
So that I can save on storage cost
```

### What: User Acceptance Criteria

```
Given a note exists with an image
When the note is deleted successfully
Then delete the associated image
```

```
Given a note exists with an image
When the note fails to delete
Then do not delete the associated image
```



[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/016-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/018-step)
