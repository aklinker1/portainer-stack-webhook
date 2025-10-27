# Changelog

## v0.2.3

[compare changes](https://github.com/aklinker1/portainer-stack-webhook/compare/v0.2.2...v0.2.3)

### 🏡 Chore

- Use `--frozen-lockfile` in dockerfile ([bee063b](https://github.com/aklinker1/portainer-stack-webhook/commit/bee063b))
- Rename env vars to add `PORTAINER_` prefix ([#7](https://github.com/aklinker1/portainer-stack-webhook/pull/7))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v0.2.2

[compare changes](https://github.com/aklinker1/portainer-stack-webhook/compare/v0.2.1...v0.2.2)

### 🚀 Enhancements

- Support `X-API-Key` header authentication ([#6](https://github.com/aklinker1/portainer-stack-webhook/pull/6))

### 🏡 Chore

- Update docs link ([08a0011](https://github.com/aklinker1/portainer-stack-webhook/commit/08a0011))
- Refactor for better type-safety and testability ([#3](https://github.com/aklinker1/portainer-stack-webhook/pull/3))
- **ai:** Add `AGENTS.md` ([d2debe8](https://github.com/aklinker1/portainer-stack-webhook/commit/d2debe8))
- Add prettier ([8e0ec7b](https://github.com/aklinker1/portainer-stack-webhook/commit/8e0ec7b))
- Upgrade `@aklinker1/zeta` ([4cfd0f1](https://github.com/aklinker1/portainer-stack-webhook/commit/4cfd0f1))
- Upgrade Bun to 1.3.1 ([e23827e](https://github.com/aklinker1/portainer-stack-webhook/commit/e23827e))
- Upgrade `@aklinker1/zeta` to fix bug ([dfa4d61](https://github.com/aklinker1/portainer-stack-webhook/commit/dfa4d61))
- Add `@aklinker1/zero-factory` and move around test utils ([#5](https://github.com/aklinker1/portainer-stack-webhook/pull/5))

### 🤖 CI

- Update workflow setup ([#4](https://github.com/aklinker1/portainer-stack-webhook/pull/4))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v0.2.1

[compare changes](https://github.com/aklinker1/portainer-stack-webhook/compare/v0.2.0...v0.2.1)

### 🏡 Chore

- Fix mismatched casing ([2ccec88](https://github.com/aklinker1/portainer-stack-webhook/commit/2ccec88))
- Fix dockerfile ([d6adbee](https://github.com/aklinker1/portainer-stack-webhook/commit/d6adbee))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v0.2.0

[compare changes](https://github.com/aklinker1/portainer-stack-webhook/compare/v0.1.7...v0.2.0)

### 🏡 Chore

- Upgrade bun to 1.2.21 ([fdda0cf](https://github.com/aklinker1/portainer-stack-webhook/commit/fdda0cf))
- Add missing lockfile ([c29fc68](https://github.com/aklinker1/portainer-stack-webhook/commit/c29fc68))
- ⚠️  Refactor to use `@aklinker1/zeta` and provide API docs ([23d326e](https://github.com/aklinker1/portainer-stack-webhook/commit/23d326e))
- Fix checks, add dev script ([0d1c38f](https://github.com/aklinker1/portainer-stack-webhook/commit/0d1c38f))
- Fix lint ([511eccf](https://github.com/aklinker1/portainer-stack-webhook/commit/511eccf))

#### ⚠️ Breaking Changes

- ⚠️  Refactor to use `@aklinker1/zeta` and provide API docs ([23d326e](https://github.com/aklinker1/portainer-stack-webhook/commit/23d326e))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v0.1.7

[compare changes](https://github.com/aklinker1/portainer-stack-webhook/compare/v0.1.6...v0.1.7)

### 🩹 Fixes

- Don't prune unused services ([a6d70c3](https://github.com/aklinker1/portainer-stack-webhook/commit/a6d70c3))
- 404 from `GET /api/stacks` ([130a53b](https://github.com/aklinker1/portainer-stack-webhook/commit/130a53b))
- Correct error message typo ([a0faea5](https://github.com/aklinker1/portainer-stack-webhook/commit/a0faea5))

## v0.1.6

[compare changes](https://github.com/aklinker1/portainer-stack-webhook/compare/v0.1.5...v0.1.6)

### 🩹 Fixes

- Move `package.json` to correct location relative to `src/index.ts` ([4f4f1b2](https://github.com/aklinker1/portainer-stack-webhook/commit/4f4f1b2))

## v0.1.5

[compare changes](https://github.com/aklinker1/portainer-stack-webhook/compare/v0.1.4...v0.1.5)

### 🩹 Fixes

- Include `package.json` in docker image ([6878d9f](https://github.com/aklinker1/portainer-stack-webhook/commit/6878d9f))

### 🏡 Chore

- Remove unused import ([002044c](https://github.com/aklinker1/portainer-stack-webhook/commit/002044c))

## v0.1.4

[compare changes](https://github.com/aklinker1/portainer-stack-webhook/compare/v0.1.3...v0.1.4)

## v0.1.3

[compare changes](https://github.com/aklinker1/portainer-stack-webhook/compare/v0.1.2...v0.1.3)

### 🩹 Fixes

- Print version on startup ([26c0797](https://github.com/aklinker1/portainer-stack-webhook/commit/26c0797))

## v0.1.2

### 🚀 Enhancements

- List stacks at `/api/stacks` ([be6ebb7](https://github.com/aklinker1/portainer-stack-webhook/commit/be6ebb7))

### 🤖 CI

- Fix GitHub release generation ([aa6e353](https://github.com/aklinker1/portainer-stack-webhook/commit/aa6e353))

## v0.1.1

### 🚀 Enhancements

- Update portainer stacks ([25a8916](https://github.com/aklinker1/portainer-stack-webhook/commit/25a8916))

### 📖 Documentation

- Cleanup README ([6f28720](https://github.com/aklinker1/portainer-stack-webhook/commit/6f28720))

### 🤖 CI

- Add validation workflow ([b31e624](https://github.com/aklinker1/portainer-stack-webhook/commit/b31e624))
- Fix failing tests in CI ([#1](https://github.com/aklinker1/portainer-stack-webhook/pull/1))
- Add release workflow ([c0c8546](https://github.com/aklinker1/portainer-stack-webhook/commit/c0c8546))
