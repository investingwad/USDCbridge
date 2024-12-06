import * as React from "react";
import { useDispatch } from "react-redux";
import WalletProvider from "./walletProvider";
import { login } from "./logic/actions/actions";
import Ethereum from "./ethComponent";
import Eos from "./eosComponent";
import EosTransaction from "./eostransaction";

const { useEffect, useState } = React;

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const toggleLogin = (logged) => {
    setLoggedIn(logged);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const connectWallet = async (walletType) => {
      try {
        await WalletProvider.login(walletType);
        const wallet = WalletProvider.getWallet();

        if (!!wallet) {
          dispatch(login({ username: wallet?.auth?.accountName }));
          toggleLogin(true);
        }
      } catch (e) {
        console.log("something went wrong ", e);
      }
    };

    const walletType = localStorage.getItem("walletType");

    if (!!walletType) {
      let wallet = parseInt(walletType);

      if (wallet >= 0) {
        connectWallet(wallet);
      }
    }
  }, []);

  return (
    <div>
      <Eos toggleLogin={toggleLogin} />
      <Ethereum />
      <EosTransaction loggedIn={loggedIn} />
    </div>
  );
}

export default App;
