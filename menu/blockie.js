import Blockies from "react-blockies";
import { useMoralis } from "react-moralis";

/**
 * Shows a blockie image for the provided wallet address
 * @param {*} props
 * @returns <Blockies> JSX Elemenet
 */

function Blockie(props) {
  const { account } = useMoralis();
  if (!props.address && !account) return <div style={{ width: 40, height: 40, background: 'transparent'}}/>;

  return (
    <Blockies
      seed={props.currentWallet ? account.toLowerCase() : props.address.toLowerCase()}
      className="identicon"
      {...props}
    />
  );
}

export default Blockie;
