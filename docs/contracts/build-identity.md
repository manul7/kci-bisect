# Build Identity Contract

**Status:** DRAFT

**Version:** 1

This contract defines source identity and build identity.

The purpose is auditability and reproducibility. Each bisection step must record enough build
input identity to explain what source, configuration, toolchain, and builder backend produced the
kernel artifact that was tested.

## Source Identity

This identifies the source tree and commit built at a step.

It contains:

- `url`: source repository URL from the campaign request;
- `commit`: resolved commit SHA selected for the step.

## Build Identity

This identifies the inputs BTO gives a builder role to attempt a build for a step.

Required fields:

- `source`: source identity as defined above;
- `arch`: target architecture;
- `config`: normalized build configuration input;
- `toolchain`: toolchain identity from campaign `scope.toolchain`; `name` required, `version`
  optional in the requested identity, present in the reported identity when resolved (oq-025);
- `build_producer`: identity and characteristics of the selected builder role backend;

`config` is the normalized build configuration: `config.base` is the base kernel configuration
target and `config.fragments` is the ordered list of configuration fragment references. These are
derived from campaign scope — `scope.kernel_config.target` maps to `config.base` and
`scope.kernel_config.fragments` maps to `config.fragments`. This contract is the single source for
that mapping; consumers reference it rather than restating the field rename.

Build identity has two forms with the same shape: requested (what BTO asks the builder to build)
and reported (what the builder returns for a content-attributable build, see
[build-test-plan-result](build-test-plan-result.md)).

Example:

```json
{
  "source": {
    "url": "SOURCE_REPO_URL",
    "commit": "COMMIT_SHA"
  },
  "arch": "TARGET_SUT_ARCH",
  "config": {
    "base": "KERNEL_CONFIG_NAME",
    "fragments": []
  },
  "toolchain": {
    "name": "TOOLCHAIN_NAME",
    "version": "VERSION"
  },
  "build_producer": {
    "name": "BUILD_PRODUCER_NAME",
    "version": "VERSION",
    "parameters": {}
  }
}
```
