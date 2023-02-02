import { Network, Alchemy } from "alchemy-sdk";
import { ALCHEMY_KEY } from "../keys";

const settings = {
	apiKey: ALCHEMY_KEY,
	network: Network["ETH_MAINNET"],
};

const alchemy = new Alchemy(settings);

export default alchemy;