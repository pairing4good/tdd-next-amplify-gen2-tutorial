![Security Checks](https://github.com/pairing4good/tdd-next-template/actions/workflows/codeql-analysis.yml/badge.svg)
![Linting Checks](https://github.com/pairing4good/tdd-next-template/actions/workflows/linting.yml/badge.svg)
![React Tests](https://github.com/pairing4good/tdd-next-template/actions/workflows/node.js.yml/badge.svg)
![Cypress Tests](https://github.com/pairing4good/tdd-next-template/actions/workflows/cypress.yml/badge.svg)

## Usage

- Click the `Use this template` button on the top right
- Click on `Settings > Code security and analysis`
  - Enable `Dependabot alerts`
  - Enable `Dependabot security updates`
- Update badges at the top of the `README.md` to point to your new repositories GitHub Action results

```
![Security Checks](https://github.com/{username}/{repository}/actions/workflows/codeql-analysis.yml/badge.svg)
![React Tests](https://github.com/{username}/{repository}/actions/workflows/node.js.yml/badge.svg)
![Cypress Tests](https://github.com/{username}/{repository}/actions/workflows/cypress.yml/badge.svg)
```

- [Clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) your new repository
- Update the `name` of your application in the `package.json` file in the root of your repository
- Run `npm install`

## Approach

This starter template bootstraps your repository with coding standards, industry best practices and detects security vulnerabilities. This template provides fast code analysis and automated testing feedback loops so you can focus on solving problems.

## Code Analysis

This template uses [ESLint](https://nextjs.org/docs/pages/building-your-application/configuring/eslint) to analyze the code in this repository. 

To run [ESLint](https://eslint.org/) run the command `npm run lint`. [ESLint](https://eslint.org/) can also automatically fix problems by running `npm run lint:fix`.

If you are using [VSCode](https://code.visualstudio.com/) adding the ESLint (dbaeumer.vscode-eslint) plugin provides live feedback as you are writing code.  Faster feedback loops help team members learn team style guidelines faster and avoid delays while committing.

## Credentials Check

It's all too common for developers to accidentally commit usernames and or passwords into their repository. This can lead to significant security vulnerabilities and even lead to security breaches. [Secretlint](https://github.com/secretlint/secretlint) is a pluggable linting tool that prevents developers from committing their credentials. [Secretlint](https://github.com/secretlint/secretlint) is configured in the `.secretlintrc.json` file at the root of this repository.

To run [Secretlint](https://github.com/secretlint/secretlint) run the command `npm run secretlint`.

## Testing Pyramid
Products that are [test driven](https://en.wikipedia.org/wiki/Test-driven_development) have lower [defect](https://en.wikipedia.org/wiki/Software_bug) rates.  Teams that distribute test coverage according to the [testing pyramid](https://martinfowler.com/bliki/TestPyramid.html) build products that are easier to change.  The `App.test.js` test uses the [React Test Renderer](https://reactjs.org/docs/test-renderer.html) which uses the [React](https://reactjs.org/) framework to render a [Component](https://reactjs.org/docs/react-component.html).  The use of [React Test Renderer](https://reactjs.org/docs/test-renderer.html) [integrates](https://martinfowler.com/bliki/IntegrationTest.html) the framework's rendering capabilities with the plain `App.js` component.  Therefore, this test fits in the middle of the pyramid.  These tests are a bit slower and more costly to maintain than completely isolated [unit tests](https://martinfowler.com/bliki/UnitTest.html) at the bottom of the [testing pyramid](https://martinfowler.com/bliki/TestPyramid.html).  

[Cypress](https://www.cypress.io/) tests fit at the top of the [testing pyramid](https://martinfowler.com/bliki/TestPyramid.html).  They are the slowest to run and the most expensive to write, run and maintain.  Nevertheless, these tests are vital for the success of any healthy product.  Teams should limit these tests to 5 - 10 of the most common [happy paths](https://en.wikipedia.org/wiki/Happy_path) through the product.  To run [Cypress](https://www.cypress.io/) test open a terminal window and run `npm start` to start the application.  Once the application is started, open a second terminal window and run `npm run cypress:run`.  If you wish to use the [Cypress Launchpad](https://docs.cypress.io/guides/getting-started/opening-the-app) run `npm run cypress:open` instead.

## Code Coverage

Test automation is essential for longterm product health. Each test exercises the application and ensures that it behaves the way that the customer expects. As products grow it's not uncommon to have tens of thousands of [unit tests](https://martinfowler.com/bliki/UnitTest.html) that run in a few milliseconds. Beyond [unit tests](https://martinfowler.com/bliki/UnitTest.html) teams invest in [integration tests](https://martinfowler.com/bliki/IntegrationTest.html) and [user interface testing](https://martinfowler.com/bliki/TestPyramid.html). Teams that are committed to [test driving](https://en.wikipedia.org/wiki/Test-driven_development) code often write thoughtful tests that provide comprehensive product test coverage.

Code coverage verification can be useful for teams to identify test coverage holes within their product. These thresholds simply identify if a line of code was exercised by a test. However, it cannot determine if the test coverage is exercising the code in a meaningful way. Code coverage thresholds only identify test coverage gaps and should not be used as a substitute for a strong team culture of [test driving](https://en.wikipedia.org/wiki/Test-driven_development) code.

This repository uses the [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/). By default [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) is configured to use [Jest](https://jestjs.io/) under the hood. Within [Jest](https://jestjs.io/), [test coverage thresholds](https://jestjs.io/docs/configuration#coveragethreshold-object) are set in the `jest.config.js` file at the root of this repository.

[Cypress](https://www.cypress.io/) tests are not included in code coverage metrics.  End-to-end, full-stack integration tests often touch significant amounts of code without providing the level of coverage that thoughtful unit or integration tests provide lower in the testing pyramid.  While they serve a crucial role in holistic testing, they don't contribute to test coverage calculations.

## Checks Before Committing

This template uses [Husky](https://typicode.github.io/husky) to verify the code before it’s committed to [git](https://git-scm.com/). The `.husky/pre-commit` file is run before a `git commit` is completed.

Before each commit, [Husky](https://typicode.github.io/husky) checks for secrets within the code.  If a secret is found it will stop the commit and will require the secret to be removed from the commit.  Committing secrets is a very common mistake and must be avoided.

## Continuous Integration Builds
This template uses [GitHub Actions](https://docs.github.com/en/actions) to run [continuous integration](https://en.wikipedia.org/wiki/Continuous_integration) builds after each push and pull request within GitHub.

- `.github/workflows/codeql-analysis.yml` sets up [code scanning](https://docs.github.com/en/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/configuring-code-scanning) for your repository.
- `.github/workflows/node.js.yml` runs tests against your code.
- `.github/workflows/cypress.yml` runs cypress tests against your code.
- `.github/workflows/linting.yml` runs [ESLint](https://nextjs.org/docs/pages/building-your-application/configuring/eslint) against the code along with [secretlint](https://github.com/secretlint/secretlint)
