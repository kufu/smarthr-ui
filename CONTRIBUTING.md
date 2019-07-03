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

## Release

```sh
$ yarn release
```

We use `standard-version` to release npm packages.
