import { useState, useEffect } from "react";
import Modal from "./modal";
import ConnectModal from "./wallets";
import WalletProvider from "./walletProvider";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./logic/actions/actions";
const ethereum_address = require("ethereum-address");

const registerSchema = Yup.object().shape({
  address: Yup.string()
    .required("Enter ethereum address")
    .test("ethereumaddress", `Invalid ethereum address`, (address) =>
      ethereum_address.isAddress(address)
    ),
});

const updateSchema = Yup.object().shape({
  oldaddress: Yup.string()
    .required("Enter old ethereum address")
    .test("ethereumaddress", `Invalid ethereum address`, (address) =>
      ethereum_address.isAddress(address)
    ),
  newaddress: Yup.string()
    .required("Enter new ethereum address")
    .test("ethereumaddress", `Invalid ethereum address`, (address) =>
      ethereum_address.isAddress(address)
    ),
});

const initialRegister = {
  address: "",
};

const initialUpdate = {
  oldaddress: "",
  newaddress: "",
};

const Eos = (props) => {
  const username = useSelector((state) => state.user.username);
  const walletConnected = useSelector((state) => state.user.walletConnected);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [regstloading, setRegisterLoading] = useState(false);
  const [updateloading, setUpdateLoading] = useState(false);
  const [regerrorMsg, setregerrorMsg] = useState("");
  const [errorMsg, seterrorMsg] = useState("");
  const [successMsg, setsuccessMsg] = useState("");
  const [regsuccessMsg, setregsuccessMsg] = useState("");

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
      const { oldaddress, newaddress } = values;
      console.log("address----", oldaddress, newaddress);
      if (!!wallet) {
        if (oldaddress == newaddress) {
          seterrorMsg("Both addresses should not be same!");
          setUpdateLoading(false);
        }
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
                  memo: "modification fees",
                },
              },
              {
                account: "etheosmultok",
                name: "modethadress",
                authorization: [
                  {
                    actor: wallet.auth.accountName,
                    permission: wallet.auth.permission,
                  },
                ],
                data: {
                  account: wallet.auth.accountName,
                  ethaddress: oldaddress,
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
      console.log("err----", e);
      seterrorMsg(e.message);
      setUpdateLoading(false);
    } finally {
      setUpdateLoading(false);
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
          {/* <div>{username}</div> */}
          {/* <button className="loginbtn" onClick={connectToWallet}>
            {walletConnected
              ? `Logout From ${username}`
              : "Connect to Eos Wallet"}
          </button> */}
          <div className="register">
            <Formik
              initialValues={initialUpdate}
              validationSchema={updateSchema}
              onSubmit={handleUpdate}
            >
              <Form>
                <div>
                  <Field
                    name="oldaddress"
                    placeholder="enter old ethereum address"
                  />
                </div>
                <div>
                  <ErrorMessage name="oldaddress" className="error" />
                </div>

                <div>
                  <Field
                    name="newaddress"
                    placeholder="enter new ethereum address"
                  />
                </div>
                <div>
                  <ErrorMessage name="newaddress" className="error" />
                </div>
                <div>
                  <div className="note">
                    Note:- 1 EOS will be charged for modification fees.
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
            </Formik>
          </div>
        </div>
        {/* <a
          href="https://docs.google.com/document/d/1peh47G369IqMjHkA3FptsODB5kRNN0DBSc17GNvzX1Q/edit?usp=sharing"
          target="_blank"
          rel="noreferrer"
        >
          Click here for help
        </a> */}
        {errorMsg ? (
          <div className="error">{errorMsg}</div>
        ) : (
          <div className="success">{successMsg}</div>
        )}
        {/* {show ? (
          <Modal show={show}>
            <ConnectModal
              closeModal={closeModal}
              toggleLogin={props.toggleLogin}
            />
          </Modal>
        ) : null} */}
      </div>
    </div>
  );
};

export default Eos;
