import crypto from "crypto";
import { ethers } from "ethers";

/**
 * Generate hash of private key from the mnemonics with various derivation path suffixes
 * this will act as the secret for JWT signing
 * @param derivationSuffix
 * @returns
 */
const generateSecret = (derivationSuffix: number) => {
  const wallet = ethers.Wallet.fromMnemonic(
    process.env.MNEMONIC as string,
    `${process.env.PATH_PASS_ENCRYPT as string}${derivationSuffix}`
  );
  return crypto.createHash("md5").update(wallet.privateKey).digest("hex");
};

export default generateSecret;
