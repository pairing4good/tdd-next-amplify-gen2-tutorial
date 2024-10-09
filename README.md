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



[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/017-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/019-step)
