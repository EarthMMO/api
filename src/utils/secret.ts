import { ethers } from 'ethers';
import crypto from 'crypto';

/**
 * Generate hash of private key from the mnemonics with various derivation path suffixes
 * this will act as the secret for JWT signing
 * @param derivationSuffix
 * @returns
 */

export const generateSecret = (derivationSuffix: number) => {

  const wallet = ethers.Wallet.fromMnemonic(
    process.env.MNEMONIC as string,
    `${process.env.PATH_PASS_ENCRYPT as string}${derivationSuffix}`
  );
  return crypto.createHash('md5').update(wallet.privateKey).digest('hex');
};
