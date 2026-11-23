# How to contribute

Thank you for reading this!

`smarthr-ui` is intended to be used for SmartHR internally, but we are welcoming your contributions!

## Before opening a pull request

Using AI tools to help you write code is fine, but you must be able to explain
what your change does, why it's needed, and how it fits with this component's
existing design and conventions. Pull requests that appear to be AI-generated
without that understanding, or that don't account for the project's existing
context and conventions, may be rejected without detailed review.

If you're unsure whether your change fits with the project's direction,
consider opening an issue to discuss it first.

## Setup

We use `pnpm` for the package manager.

```sh
$ corepack enable
$ corepack prepare
$ pnpm install
```

## Test

```sh
$ pnpm ui test
```

## Commit

We use [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0-beta.4/) for [`release-please`](https://github.com/googleapis/release-please).

## CI

The SmartHR UI uses [CircleCI](https://circleci.com/).

- lint
  - Grammar check with ESLint
  - TypeScript grammar check with `tsc --noEmit`
- Unit test
  - Unit and component testing with [Vitest](https://vitest.dev/)
- visual regression test
  - [Chromatic](https://www.chromatic.com/) publishes Storybook and runs visual regression testing for every PR. A preview link is posted as a status check on the PR.

If any of the above is missing, please correct the code.

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

We use [`release-please`](https://github.com/googleapis/release-please) to release npm packages. It opens a release PR based on conventional commit messages on `master`, and merging that PR triggers the publish to npm automatically. There is no manual release command to run.
