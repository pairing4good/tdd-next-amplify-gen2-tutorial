# TDD AWS Amplify Next App - Step 11

## Set Up AWS Amplify

We now have a fully functioning task creation application. When we showed this to our customer they provided some feedback. They would like:

- to secure this application with a user login
- notes to show up on multiple devices

While `localStorage` provided a quick way to save notes and get valuable customer feedback, it isn't designed for secure, cross-device persistence. [Amazon Web Services](https://aws.amazon.com) does provide services that solve both of these [use cases](https://en.wikipedia.org/wiki/Use_case) and positions our React app for additional possibilities like [notifications](https://aws.amazon.com/sns), backend processing, storing note attachments, and much more. [AWS Amplify](https://aws.amazon.com/amplify) provides a set of tools that significantly simplify connection web and mobile applications to an AWS backend.

- Install the [Install the Amplify CLI](https://docs.amplify.aws/cli/start/install)
- Run `amplify init` at the root of the project

```
Project information
| Name: tddamplifyreact
| Environment: dev
| Default editor: Visual Studio Code
| App type: javascript
| Javascript framework: react
| Source Directory Path: src
| Distribution Directory Path: build
| Build Command: npm run-script build
| Start Command: npm run-script start

Select the authentication method you want to use: AWS profile
Please choose the profile you want to use: default
```

- This command created the `amplify/` directory which contains Amplify configuration files.
- This command created the following resources on AWS
  - UnauthRole AWS::IAM::Role
  - AuthRole AWS::IAM::Role
  - DeploymentBucket AWS::S3::Bucket
  - amplify-tddamplifyreact-dev-12345

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/010-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/012-step)
