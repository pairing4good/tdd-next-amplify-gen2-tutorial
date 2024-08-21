# TDD AWS Amplify Next App - Step 11

## Set Up AWS Amplify

We now have a fully functioning task creation application. When we showed this to our customer they provided some feedback. They would like:

- to secure this application with a user login
- notes to show up on multiple devices

While `localStorage` provided a quick way to save notes and get valuable customer feedback, it isn't designed for secure, cross-device persistence. [Amazon Web Services](https://aws.amazon.com) does provide services that solve both of these [use cases](https://en.wikipedia.org/wiki/Use_case) and positions our React app for additional possibilities like [notifications](https://aws.amazon.com/sns), backend processing, storing note attachments, and much more. [AWS Amplify](https://aws.amazon.com/amplify) provides a set of tools that significantly simplify connection web and mobile applications to an AWS backend.

- Run `npm create amplify@latest` at the root of the project
- Press `Enter` when prompted with `? Where should we create your project? .`

- This command created the `amplify/` directory which contains the following files:
  - auth
    - resource.ts
  - data
    - resource.ts
  - backend.ts
  - package.json
  - tsconfig.json

AWS Amplify Gen 2 uses these TypeScript files to define the backend.

- Commit and [push](https://code.visualstudio.com/docs/sourcecontrol/intro-to-git#_pushing-and-pulling-remote-changes) your changes to your GitHub repository

### Deploy your App to AWS Amplify
- If you don't have an AWS Account, [create](https://aws.amazon.com/free/) one
- Log into your AWS Account
- Navigate to https://[your-region].console.aws.amazon.com/amplify/apps.  Be sure to replace `[your-region]` with your region.
- Click the `Create new app` button
- Click the `GitHub` button
- Click the `Next` button and authorize your GiHub account
- Select your repository and branch
- Accept the default values to deploy your new app
- One your app is deployed, click on your deployed branch
- Click on the `Deployed backend resources` tab
- Click on the `Download amplify_outputs.json file` button
- Once the file is downloaded, copy it to the root of your project

### Configuring your Amplify Deployment Pipeline
- At the root of your project create an `amplify.yml` file with the following content

```yml
version: 1
backend:
  phases:
    build:
      commands:
        - npm ci --cache .npm --prefer-offline
        - npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run test && npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - .npm/**/*
      - node_modules/**/*
test:
  phases:
    preTest:
      commands:
        - npm ci
        - npm install -g pm2
        - npm install -g wait-on
        - npm install mocha mochawesome mochawesome-merge mochawesome-report-generator
        - pm2 start npm -- run dev
        - wait-on http://localhost:3000
    test:
      commands:
        - 'npx cypress run --reporter mochawesome --reporter-options "reportDir=cypress/report/mochawesome-report,overwrite=false,html=false,json=true,timestamp=mmddyyyy_HHMMss"'
    postTest:
      commands:
        - npx mochawesome-merge cypress/report/mochawesome-report/mochawesome*.json > cypress/report/mochawesome.json
        - pm2 kill
  artifacts:
    baseDirectory: cypress
    configFilePath: '**/mochawesome.json'
    files:
      - '**/*.png'
      - '**/*.mp4'
```

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/010-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/012-step)
