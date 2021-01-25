import { useState, useEffect } from "react";
import Modal from "./modal";
import ConnectModal from "./wallets";
import WalletProvider from "./walletProvider";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./logic/actions/actions";
import { Ethlogin } from "./logic/actions/actions";
//@ts-ignore
import EosApi from "eosjs-api";
import { contracts, eosEndpoint, tables } from "./config";
const ethereum_address = require("ethereum-address");

const updateSchema = Yup.object().shape({
  newaddress: Yup.string()
    .required("Enter new ethereum address")
    .test("ethereumaddress", `Invalid ethereum address`, (address) =>
      ethereum_address.isAddress(address)
    ),
});

const initialUpdate = {
  newaddress: "",
};

const options = {
  httpEndpoint: eosEndpoint,
};
const eos = EosApi(options);

const Eos = (props) => {
  const username = useSelector((state) => state.user.username);
  const walletConnected = useSelector((state) => state.user.walletConnected);
  const ethwalletConnected = useSelector(
    (state) => state.address.ethWalletConnected
  );
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [regstloading, setRegisterLoading] = useState(false);
  const [updateloading, setUpdateLoading] = useState(false);
  const [regerrorMsg, setregerrorMsg] = useState("");
  const [errorMsg, seterrorMsg] = useState("");
  const [successMsg, setsuccessMsg] = useState("");
  const [regsuccessMsg, setregsuccessMsg] = useState("");
  const [ethaddress, setAddress] = useState("");
  const [registerfee, setRegisterFee] = useState("0.0000 EOS");

  const registerSchema = Yup.object().shape({
    address: Yup.string()
      .required("Enter ethereum address")
      .test("ethereumaddress", `Invalid ethereum address`, (address) => {
        console.log("addddddddddd----", address);
        return ethereum_address.isAddress(address);
      }),
  });

  const initialRegister = {
    address: ethaddress,
  };

  useEffect(() => {
    const getfees = async () => {
      const requests = await eos.getTableRows({
        code: contracts.BRIDGE_CON,
        scope: contracts.BRIDGE_CON,
        table: tables.Configs,
        json: "true",
      });
      if (requests.rows.length) {
        const fee = await requests.row[0].registrationfee;
        setRegisterFee(fee);
      }
    };
    getfees();
  }, []);

  const closeModal = () => {
    setShow(false);
  };

  const connectToWallet = async () => {
    if (walletConnected) {
      try {
        const wallet = WalletProvider.getWallet();
        if (!!wallet) {
          await WalletProvider.disconnectWallet();
          dispatch(logout());
          localStorage.clear();
          props.toggleLogin(false);
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
      console.log("address----", values);
      if (!walletConnected) {
        setregerrorMsg("Eos wallet is not connected");
      }
      if (!ethwalletConnected) {
        setregerrorMsg("Ethereum wallet is not connected");
      }
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
                  to: contracts.BRIDGE_CON,
                  quantity: registerfee,
                  memo: "registration fees",
                },
              },
              {
                account: contracts.BRIDGE_CON,
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
          setregsuccessMsg("Transaction Success");
          setregerrorMsg("");
        }
      } else {
        setRegisterLoading(false);
      }
    } catch (e) {
      console.log("err----", e);
      setregerrorMsg(e.message);
      setRegisterLoading(false);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    try {
      setUpdateLoading(true);
      const eosAmount = 1;
      const wallet = WalletProvider.getWallet();
      const { newaddress } = values;
      console.log("address----", newaddress);
      if (!walletConnected) {
        seterrorMsg("Eos wallet is not connected");
      }
      if (!ethwalletConnected) {
        seterrorMsg("Ethereum wallet is not connected");
      }
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
                  to: contracts.BRIDGE_CON,
                  quantity: registerfee,
                  memo: "modification fees",
                },
              },
              {
                account: contracts.BRIDGE_CON,
                name: "modethadress",
                authorization: [
                  {
                    actor: wallet.auth.accountName,
                    permission: wallet.auth.permission,
                  },
                ],
                data: {
                  account: wallet.auth.accountName,
                  newethaddress: newaddress,
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
          setUpdateLoading(false);
          setsuccessMsg("Transaction Success");
          seterrorMsg("");
        }
      } else {
        setUpdateLoading(false);
      }
    } catch (e) {
      seterrorMsg(e.message);
      setUpdateLoading(false);
    } finally {
      setUpdateLoading(false);
    }
  };

  const connectToMetamask = async () => {
    try {
      const { ethereum } = window;
      const { chainId } = ethereum;

      if (chainId === "0x3") {
        if (!!ethereum) {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          setAddress(accounts[0]);
          dispatch(Ethlogin({ address: accounts[0] }));
        }
      } else {
        alert("Please select  test network then connect");
      }
    } catch (e) {
      console.log("something went wrong ", e);
    }
  };

  return (
    <div>
      <div className="form-container">
        <div>1. Register Ethereum Address on EOS</div>
        <div className="login">
          <button className="loginbtn" onClick={connectToWallet}>
            {walletConnected
              ? `Logout From ${username}`
              : "Connect to Eos Wallet"}
          </button>
          <button onClick={connectToMetamask}>
            {!!ethaddress ? "Connected" : "Connect to metamask"}
          </button>
          <div className="register">
            <Formik
              initialValues={initialRegister}
              validationSchema={registerSchema}
              onSubmit={handleRegister}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div>
                    <Field
                      name="address"
                      placeholder="enter ethereum address"
                      onClick={() => setFieldValue("address", ethaddress)}
                    />
                  </div>
                  <div>
                    <ErrorMessage name="address" className="error" />
                  </div>
                  <div>
                    <div className="note">
                      Note:- Current registration fee {registerfee} will be
                      deducted from your account.
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
              )}
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
        {regerrorMsg ? (
          <div className="error">{regerrorMsg}</div>
        ) : (
          <div className="success">{regsuccessMsg}</div>
        )}
        {show ? (
          <Modal show={show}>
            <ConnectModal
              closeModal={closeModal}
              toggleLogin={props.toggleLogin}
            />
          </Modal>
        ) : null}
      </div>

      <div className="form-container">
        <div>2. Modify Ethereum Address on EOS</div>
        <div className="login">
          <div className="register">
            <Formik
              initialValues={initialUpdate}
              validationSchema={updateSchema}
              onSubmit={handleUpdate}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div>
                    <Field
                      name="newaddress"
                      placeholder="enter new ethereum address"
                      onClick={() => setFieldValue("newaddress", ethaddress)}
                    />
                  </div>
                  <div>
                    <ErrorMessage name="newaddress" className="error" />
                  </div>
                  <div>
                    <div className="note">
                      Note:- Current modification fee {registerfee} will be
                      deducted from your account.
                    </div>
                    <button
                      type="submit"
                      className="sendbtn"
                      disabled={updateloading}
                    >
                      {updateloading ? "updating" : "Update Address"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        {errorMsg ? (
          <div className="error">{errorMsg}</div>
        ) : (
          <div className="success">{successMsg}</div>
        )}
      </div>
    </div>
  );
};

export default Eos;
