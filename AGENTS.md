# AGENTS Guide for `hardhat-enscribe`

This guide helps AI agents contribute safely to this plugin and assist developers using it during contract deployment and naming.

## Mission

Enable developers to assign ENS names to contracts from Hardhat using this plugin, which delegates naming operations to `@enscribe/enscribe`.

## Read These Files First

1. `src/index.ts` - plugin registration and task definitions
2. `src/internal/tasks/name.ts` - runtime behavior of `enscribe name`
3. `demo/hardhat.config.ts` - canonical integration pattern
4. `demo/scripts/deploy-counter-and-name.ts` - deploy + name flow
5. `test/enscribe.hardhat.test.ts` - end-to-end expected behavior
6. `package.json` - scripts and dependency constraints

## Canonical User Flows

### Flow A: Configure Plugin In A Project
- Add plugins:
  - `@nomicfoundation/hardhat-toolbox-viem`
  - `@enscribe/hardhat-enscribe`
- Configure networks with RPC URL and accounts.
- Build and verify task availability.

### Flow B: Name Existing Contract
- Command:
  - `npx hardhat enscribe name <name> --contract <address> --network <network>`
- Task normalizes ENS name, resolves wallet client from Viem, and calls `nameContract`.

### Flow C: Deploy Then Name
- Use Ignition deployment, then call `nameContract` directly (see demo script).
- Return explorer URL and transaction hashes for user confirmation.

## Behavioral Truths (Important)

- Network selection is effectively driven by Hardhat `--network` and `hre.network.connect()`.
- Task defines `--chain`, but current task logic does not consume that argument.
- Runtime assumes Viem integration is present (`connection.viem.getWalletClients()`).
- Naming core logic is in `@enscribe/enscribe`, not this plugin.

## Agent Do/Don't

### Do
- Keep examples aligned with existing files and commands in this repo.
- Prefer minimal, reproducible commands users can run immediately.
- Validate changes with targeted tests after edits.
- Explain failures in terms of network/account/name/contract compatibility.

### Don't
- Do not invent scripts not present in `demo/scripts`.
- Do not claim undocumented config API works unless verified in current source.
- Do not treat prose docs as authoritative if code disagrees.

## Troubleshooting Playbook

1. **Task missing**  
   Confirm plugin is in `plugins` list and project was rebuilt/reinstalled.

2. **No wallet client / viem undefined**  
   Ensure Viem plugin is loaded in Hardhat config.

3. **Transaction failure**  
   Check signer funds, RPC correctness, and target network.

4. **Name validation failure**  
   Ensure ENS input is normalizable and properly formatted (`label.parent.eth`).

5. **Naming appears successful but resolution wrong**  
   Verify contract address, ENS name, and resulting tx hashes; inspect explorer URL returned by library.

## Testing Protocol For Agents

- Quick check: `pnpm run test:unit`
- Behavioral checks: `pnpm run test:integration`
- E2E confidence: start local node then run `pnpm run test:hardhat`

If only docs changed, run at least a command sanity check against documented commands.

## External Dependency Context

- Upstream library: `@enscribe/enscribe`
- Public repository: [enscribexyz/enscribe-ts](https://github.com/enscribexyz/enscribe-ts)

When uncertain about lower-level naming semantics (contract-type detection, L1/L2 behavior, tx sequence), inspect the upstream library implementation and README before changing plugin guidance.

