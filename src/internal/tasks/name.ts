import type { NewTaskActionFunction } from "hardhat/types/tasks";
import type { HardhatRuntimeEnvironment } from "hardhat/types/hre";
import "@nomicfoundation/hardhat-viem";
import { normalize } from "viem/ens";
import { nameContract } from "@enscribe/enscribe";

interface TaskNameArguments {
  name: string;
  contract?: string;
}

const taskName: NewTaskActionFunction<TaskNameArguments> = async (
  args,
  hre: HardhatRuntimeEnvironment,
) => {
  if (args.contract == null) {
    console.log("need to pass a contract address");
    return;
  }

  const networkConnection = await hre.network.connect();
  const [walletClient] = await (networkConnection as any).viem.getWalletClients();

  const nameNormalized = normalize(args.name);
  console.log(`normalized name is ${nameNormalized}`);

  // Use the library API
  try {
    console.log(`\Setting name for contract ${args.contract} on chain ${networkConnection.networkName} ...`);
    const result = await nameContract({
      name: nameNormalized,
      contractAddress: args.contract,
      walletClient: walletClient,
      chainName: networkConnection.networkName,
      opType: "hh-enscribe-nameexisting",
      enableMetrics: true, // Enable metrics logging for plugin usage
    });

    console.log(`\nNaming completed successfully!`);
    console.log(`Contract Type: ${result.contractType}`);
    console.log(`Transactions:`, result.transactions);
    console.log(`You can check your contract at:`, result.explorerUrl);
  } catch (error) {
    console.error("Error naming contract:", error);
  }
};

export default taskName;
