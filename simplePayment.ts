// simplePayment.ts
import 'dotenv/config';
import { createRadiusWallet } from '@radiustechsystems/ai-agent-wallet';

/**
 * Sends ETH from a wallet (specified by its private key) to the recipient.
 * @param recipient - The company wallet address.
 * @param amountEth - Amount in ETH.
 * @param privateKey - The private key of the bidder’s wallet.
 * @returns The transaction hash.
 */
export async function sendPayment(recipient: string, amountEth: number, privateKey: string): Promise<string> {
  const wallet = await createRadiusWallet({
    rpcUrl: process.env.RPC_PROVIDER_URL as string,
    privateKey: privateKey,
  });

  const tx = await wallet.sendTransaction({
    to: recipient,
    value: BigInt(Math.floor(amountEth * 1e18)),
  });
  console.log(`✅ Payment of ${amountEth} ETH sent to ${recipient}`);
  return tx.hash;
}
