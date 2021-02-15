import * as React from "react";
import WalletProvider from "./walletProvider";
import { useDispatch } from "react-redux";
import { login } from "./logic/actions/actions";

const { useState } = React;

const ConnectModal = (props) => {
  const { closeModal, toggleLogin } = props;
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);

  const connectWallet = async (index) => {
    try {
      setActive(index);
      setLoading(true);
      await WalletProvider.login(index);
      const wallet = WalletProvider.getWallet();
      dispatch(login({ username: wallet?.auth?.accountName }));
      toggleLogin(true)
      localStorage.setItem("walletType", index.toString());
      console.log("wallet11-----", wallet);
      closeModal();

    } catch (e) {
      console.log("something went wrong ", e);
    } finally {
      setLoading(false);
      setActive(-1);
    }
  };

  return (
    <div className="container">
      <div>
        Connect wallet
        <div className="closeBtn" onClick={closeModal}>
          <p className="close-text">close</p>
        </div>
      </div>
      <div>
        <button onClick={() => connectWallet(0)} disabled={loading}>
          {loading && active === 0 ? "connecting" : "Connect with scatter"}
        </button>
      </div>
      <div>
        <button onClick={() => connectWallet(1)} disabled={loading}>
          {loading && active === 1 ? "connecting" : "Connect with Anchor"}
        </button>
      </div>
    </div>
  );
};

export default ConnectModal;
