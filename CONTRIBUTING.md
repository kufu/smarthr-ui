# How to contribute

Thank you for reading this!

`smarthr-ui` is intended to be used for SmartHR internally, but we are welcoming your contributions!

## Setup

We use `yarn` for the package manager.

```sh
$ yarn
```

## Test

```sh
$ yarn test
```

`smarthr-ui` uses Jest's snapshot testing.

If the test results are what you expect, you can update the snapshot with the following command.

```sh
$ yarn test:update-snapshot
```

## Commit

We use [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0-beta.4/) for `standard-version`.

## CI

The SmartHR UI uses [CircleCI] (https://circleci.com/).

- lint
  - Grammar check with ESLint
  - Style description check by stylelint
  - TypeScript grammar check with `tsc --noEmit`
- Unit test
  - Unit and component testing with [Jest] (https://jestjs.io/ja/), [jest-styled-components] (https://github.com/styled-components/jest-styled-components)
- visual regression test
  - [reg-suit](https://github.com/reg-viz/reg-suit)
- Host on Netlify
  - Launch the environment on Netlify for each PR so that you can check the operation without launching locally

If any of the above is missing, please correct the code.

Merging the PR will automatically build the master branch at the following URL:
https://smarthr-ui.netlify.com/

The component displayed at this URL is up to date with the SmartHR UI.

### [reg-suit](https://github.com/reg-viz/reg-suit)

#### Fail reg-suit

reg-suit hosts the results of the image regression test in S3. To do this, we are passing `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` as environment variables to CircleCI.

For PR from fork repositories, security concerns have specified that CircleCI environment variables should not be passed. Therefore, in the case of PR from the fork repository, the CircleCI environment variable does not exist when the reg-suit is executed, AWS cannot be accessed, and CI fail.

For the above reasons, it doesn't matter if the reg-suit fails for a repository from a fork.

Review the PR and if there are no security issues we will run reg-suit.

## How to update component README

If you add or update a component, update the component README.

### Template

````markdown
# Component name

```tsx
import { ComponentName } from 'smarthr-ui'

<ComponentName />
```

## props

| Name      | Required | Type      | DefaultValue       | Description  |
| --------- | -------- | --------- | ------------------ | ------------ |
|           | ✔ or -   |           | DefaultValue or -  |              |

````

### Rule

- Required
  - Required: ✔
  - Not Required: -
- DefaultValue
  - No Default Value: -

## Release

```sh
$ yarn release
```

We use `standard-version` to release npm packages.
