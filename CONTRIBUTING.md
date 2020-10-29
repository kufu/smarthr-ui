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

If reg-suit is run and the results are diff, the status is red. In that case, make sure that you have made sure that no unintended changes have occurred.

PR from the forked repository will always drop the reg-suit. Reviewer uses [git-push-fork-to-upstream-branch] (https://github.com/jklukas/git-push-fork-to-upstream-branch) to run reg-suit and the result Please check.

## How to update component README

If you add or update a component, update the component README.

### template

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
