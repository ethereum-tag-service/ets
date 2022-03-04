import { utils, BigNumber } from "ethers";

export const timestampToString = (timestamp, language = 'en-US') => {
  const date = new Date(timestamp * 1000);
  const formatted = new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    .format(date);

  return formatted;
};

export const shorter = (str) => str?.length > 8 ? str.slice(0, 6) + '...' + str.slice(-4) : str;

export const toDp = value => !value ? value : parseFloat(value).toFixed(4);

export const toEth = (value, decimals) => {
  if (!value) return value;

  if (decimals) {
    let ether = Number(utils.formatEther(BigNumber.from(value)));
    return ether.toFixed(decimals);
  }

  return utils.formatEther(BigNumber.from(value));
}
