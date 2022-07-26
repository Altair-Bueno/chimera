# Contributing

Thanks for contributing!

## Required software

- Deno v1.23.3+
- GNU Make (optional)

## Before summiting a pull request

Make sure all test and checks pass by running `make test check`. If you don't
have GNU Make installed, you can manually run Deno's fmt, lint and test
commands.

## Makefile goals

A Makefile is provided to ease the development process with the following goals

```sh
# Run check/fmt and check/lint
make check
# Runs deno lint over source files
make check/lint
# Checks source files using deno fmt
make check/fmt
# Formats source files using deno fmt
make fmt
# Run all tests
make test
```
