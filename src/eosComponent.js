import { useState, useEffect } from "react";
import Modal from "./modal";
import ConnectModal from "./wallets";
import WalletProvider from "./walletProvider";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from 'react-redux'
import { logout } from "./logic/actions/actions";
const ethereum_address = require("ethereum-address");

const registerSchema = Yup.object().shape({
  address: Yup.string()
    .required("Enter ethereum address")
    .test("ethereumaddress", `Invalid ethereum address`, (address) =>
      ethereum_address.isAddress(address)
    ),
});

const initialRegister = {
  address: "",
};

const Eos = (props) => {
  const username = useSelector((state) => state.user.username)
  const walletConnected = useSelector((state) => state.user.walletConnected)
  const dispatch = useDispatch()
  const [show, setShow] = useState(false);
  const [regstloading, setRegisterLoading] = useState(false);
  const [errorMsg, seterrorMsg] = useState("");
  const [successMsg, setsuccessMsg] = useState("");

  const closeModal = () => {
    setShow(false);
  };

  const connectToWallet = async () => {
    if (walletConnected) {
      try {
        const wallet = WalletProvider.getWallet();
        if (!!wallet) {
          await WalletProvider.disconnectWallet();
          dispatch(logout())
          localStorage.clear();
        }
      } catch (e) {
        console.log("something went wrong ", e);
      }
    } else {
      setShow(true);
    }
  };

  const handleRegister = async (values) => {
    try {
      setRegisterLoading(true);
      const eosAmount = 1;
      const wallet = WalletProvider.getWallet();
      const { address } = values;
      console.log("address----", address);
      if (!!wallet) {
        const result = await wallet.eosApi.transact(
          {
            actions: [
              {
                account: "eosio.token",
                name: "transfer",
                authorization: [
                  {
                    actor: wallet.auth.accountName,
                    permission: wallet.auth.permission,
                  },
                ],
                data: {
                  from: wallet.auth.accountName,
                  to: "etheosmultok",
                  quantity: `${eosAmount.toFixed(4)} EOS`,
                  memo: "registration fees",
                },
              },
              {
                account: "etheosmultok",
                name: "registereth",
                authorization: [
                  {
                    actor: wallet.auth.accountName,
                    permission: wallet.auth.permission,
                  },
                ],
                data: {
                  account: wallet.auth.accountName,
                  ethaddress: address,
                },
              },
            ],
          },
          {
            broadcast: true,
            blocksBehind: 3,
            expireSeconds: 60,
          }
        );
        if (result) {
          setRegisterLoading(false);
          setsuccessMsg("Transaction Success");
          seterrorMsg("");
        }
      } else {
        setRegisterLoading(false);
      }
    } catch (e) {
      console.log("err----", e);
      seterrorMsg(
        JSON.parse(JSON.parse(JSON.stringify(e)).json.error.details[0].message)
          .error.details[0].message.toString()
          .split(":")[1]
      );
      setRegisterLoading(false);
    } finally {
      setRegisterLoading(false);
    }
  };
  return (
    <div>
      <div className="form-container">
        <div>1. Register Ethereum Address on EOS</div>
        <div className="login">
          {/* <div>{username}</div> */}
          <button className="loginbtn" onClick={connectToWallet}>
            {walletConnected
              ? `Logout From ${username}`
              : "Connect to Eos Wallet"}
          </button>
          <div className="register">
            <Formik
              initialValues={initialRegister}
              validationSchema={registerSchema}
              onSubmit={handleRegister}
            >
              <Form>
                <div>
                  <Field name="address" placeholder="enter ethereum address" />
                </div>
                <div>
                  <ErrorMessage name="address" className="error" />
                </div>
                <div>
                  <div className="note">
                    Note:- 1 EOS will be charged for registration fees.
                  </div>
                  <button
                    type="submit"
                    className="sendbtn"
                    disabled={regstloading}
                  >
                    {regstloading ? "registering" : "Register"}
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
        <a
          href="https://docs.google.com/document/d/1peh47G369IqMjHkA3FptsODB5kRNN0DBSc17GNvzX1Q/edit?usp=sharing"
          target="_blank"
          rel="noreferrer"
        >
          Click here for help
        </a>
        {errorMsg ? (
          <div className="error">{errorMsg}</div>
        ) : (
          <div className="success">{successMsg}</div>
        )}
        {show ? (
          <Modal show={show}>
            <ConnectModal closeModal={closeModal}  toggleLogin ={props.toggleLogin}/> 
          </Modal>
        ) : null}
      </div>
    </div>
  );
};

export default Eos;
