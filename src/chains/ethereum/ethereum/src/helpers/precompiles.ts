import { Account, Address } from "@ethereumjs/util";
import { EEIInterface } from "@ethereumjs/evm";

const NUM_PRECOMPILES = 18;
/**
 * An account with a balance of 1
 */
const SERIALIZED_PRECOMPILE = Uint8Array.from([
  248, 68, 128, 1, 160, 86, 232, 31, 23, 27, 204, 85, 166, 255, 131, 69, 230,
  146, 192, 248, 110, 91, 72, 224, 27, 153, 108, 173, 192, 1, 98, 47, 181, 227,
  99, 180, 33, 160, 197, 210, 70, 1, 134, 247, 35, 60, 146, 126, 125, 178, 220,
  199, 3, 192, 229, 0, 182, 83, 202, 130, 39, 59, 123, 250, 216, 4, 93, 133,
  164, 112
]);
const PRECOMPILED_ACCOUNT: Account = {
  serialize: () => SERIALIZED_PRECOMPILE
} as any;

const accountCache: Address[] = [];
const makeAccount = (i: number): Address => {
  if (accountCache[i]) return accountCache[i];

  // 20 bytes, the first 19 are 0, the last byte is the address
  const buf = Buffer.allocUnsafe(20).fill(0, 0, 19);
  buf[19] = i;
  return (accountCache[i] = { buf } as any);
};

/**
 * Puts the precompile accounts into the state tree
 * @param eei -
 */
export const activatePrecompiles = async (eei: EEIInterface) => {
  await eei.checkpoint();
  for (let i = 1; i <= NUM_PRECOMPILES; i++) {
    const account = makeAccount(i);
    eei.putAccount(account, PRECOMPILED_ACCOUNT);
  }
  await eei.commit();
};

/**
 * Puts the precompile accounts into the warmed addresses
 * @param eei -
 */
export const warmPrecompiles = async (eei: EEIInterface) => {
  for (let i = 1; i <= NUM_PRECOMPILES; i++) {
    const account = makeAccount(i);
    eei.addWarmedAddress(account.buf);
  }
};
