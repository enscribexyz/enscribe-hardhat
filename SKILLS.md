# hardhat-enscribe Agent Skills

This file defines practical skills for AI coding agents working with this repository and for agents helping developers deploy + ENS-name contracts through this plugin.

## Skill 1: Wire Plugin Into A Hardhat Project

Use when a user asks to set up ENS naming in a Hardhat v3 project.

### Inputs
- Target Hardhat project path
- Desired network (for example `sepolia`)
- RPC URL + funded private key

### Procedure
1. Install dependencies:
   - `@enscribe/hardhat-enscribe`
   - `@nomicfoundation/hardhat-toolbox-viem` (or another setup that exposes `connection.viem`)
2. In `hardhat.config.ts`, register both plugins in `plugins`.
3. Ensure the network exists in `networks` with:
   - `type: "http"`
   - `chainType: "l1"` (or the intended chain type)
   - URL and account sourced from env/config variables.
4. Build before use: `pnpm run build`.

### Verification
- Run `npx hardhat --help` and confirm `enscribe` task namespace appears.
- Run `npx hardhat enscribe name <ens-name> --contract <address> --network <network>`.

---

## Skill 2: Deploy And Name In One Flow

Use when a user wants a single command/script for deployment + naming.

### Source-of-truth example
- `demo/scripts/deploy-counter-and-name.ts`

### Procedure
1. Connect with `hre.network.connect()`.
2. Deploy with Ignition (see `demo/ignition/modules/Counter.ts`).
3. Fetch wallet via `connection.viem.getWalletClients()`.
4. Normalize ENS name with `normalize(name)`.
5. Call `nameContract` from `@enscribe/enscribe` with:
   - `name`
   - `contractAddress`
   - `walletClient`
   - `chainName: connection.networkName`
   - optional telemetry fields (`opType`, `enableMetrics`)

### Expected Outputs
- Contract type (`Ownable` or other from library detection)
- Transaction hashes (`subname`, `forwardResolution`, `reverseResolution`, optional L2 txs)
- ENScribe explorer URL

---

## Skill 3: Name Existing Deployed Contract

Use when deployment already happened and only naming is needed.

### Command Pattern
- Preferred:
  - `npx hardhat enscribe name <ens-name> --contract <0x...> --network <network>`

### Important behavior note
- The task currently defines a `--chain` option in code, but task execution uses `hre.network.connect()` network selection.
- Agents should rely on Hardhat `--network` as the effective selector.

### Failure Checks
- Missing `--contract` => task logs and exits.
- Invalid/un-normalizable ENS name => `viem/ens normalize` throws.
- Wrong network/account/funding => transaction failures from `@enscribe/enscribe` flow.

---

## Skill 4: Diagnose Naming Failures

Use when users report failed ENS naming transactions.

### Checklist
1. Confirm plugin and Viem plugin are both registered.
2. Confirm selected Hardhat network is correct and funded signer is loaded.
3. Confirm ENS name is valid and normalizable.
4. Confirm target contract address is deployed and correct.
5. Confirm contract supports required pattern (for example `owner()`).
6. Re-run with logs and inspect thrown error from `nameContract`.

### Common Root Causes
- Plugin not built/linked after local changes.
- Missing RPC/private key env vars in demo.
- Attempting to use stale doc commands that reference non-existent demo scripts.

---

## Skill 5: Validate Changes With Tests

Use when editing plugin behavior, task args, or naming flow.

### Fast-to-slow test order
1. `pnpm run test:unit`
2. `pnpm run test:integration`
3. `pnpm run test:hardhat` (requires local node at `127.0.0.1:8545`)

### High-value test files
- `src/internal/tasks/name.test.ts`
- `test/enscribe.integration.test.ts`
- `test/enscribe.hardhat.test.ts`

---

## Agent Guardrails For This Repo

- Prefer code behavior over prose docs when they conflict.
- Treat `src/index.ts` and `src/internal/tasks/name.ts` as authoritative for CLI behavior.
- Do not assume config APIs documented in `CONFIGURATION.md` are wired into runtime unless verified in code.
- Keep user-facing examples aligned to current script inventory under `demo/scripts`.

