// runSimplePayment.ts
import { sendPayment } from './simplePayment';

async function run() {
  try {
    // Replace with your recipient address.
    const recipient = process.env.AGENT_WALLET || '0xRecipientAddress';
    const txHash = await sendPayment(recipient, 0.01);
    console.log('Transaction successful! Tx Hash:', txHash);
  } catch (error) {
    console.error('❌ Payment Failed:', error);
  }
}

run();
