import { useState, useEffect } from "react";
import Modal from "./modal";
import ConnectModal from "./wallets";
import WalletProvider from "./walletProvider";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
//@ts-ignore
import EosApi from "eosjs-api";
const ethereum_address = require("ethereum-address");

const options = {
  httpEndpoint: "https://api.kylin.alohaeos.com",
};

const eos = EosApi(options);

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
const schema = Yup.object().shape({
  value: Yup.number().required("Enter value of token"),
  // .test("lowAmount", `Should be greater than 0`, (val) => parseInt(val) > 0),
  token: Yup.string().required("Select a token type"),
});

const initialValues = {
  value: "",
  token: "6,EUSDC",
};

const Eos = () => {
  const [walletConnected, setwalletConnected] = useState(false);
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [balances, setUserBalances] = useState([]);
  const [tokenSymbol, setSymbols] = useState(["6,EUSDC"]);
  const [loading, setLoading] = useState(false);
  const [regstloading, setRegisterLoading] = useState(false);
  const [errorMsg, seterrorMsg] = useState("");
  const [successMsg, setsuccessMsg] = useState("");

  const closeModal = () => {
    setShow(false);
  };

  const successModal = (username) => {
    setShow(false);
    setwalletConnected(true);
    setUsername(username);
  };

  const getTokens = async () => {
    let tokens = [];
    const requests = await eos.getTableRows({
      code: "etheosmultok",
      scope: "etheosmultok",
      table: "acceptedsym1",
      json: "true",
    });
    if (requests.rows.length) {
      requests.rows.map((row) => {
        tokens.push(row.dtoken.toString());
      });
    }
    console.log("tokesn----", tokens);
    setSymbols(tokens);
    return tokens;
  };

  const getBalance = async (tokens) => {
    try{
    if (tokens.length) {
      let userbal = [];
      for (const symbol of tokens) {
        const tokensData = {
          code: "etheosmultok",
          json: true,
          limit: 1000,
          lower_bound: username,
          scope: symbol.split(",")[1],
          table: "available",
          table_key: "",
          upper_bound: username,
        };
        const responses = await fetch(
          "https://api.kylin.alohaeos.com/v1/chain/get_table_rows",
          {
            method: "post",
            body: JSON.stringify(tokensData),
          }
        );
        const tokensdata = await responses.json();
        userbal.push(tokensdata.rows[0].balance);
      }
      console.log("userbalance ---", userbal);
      setUserBalances(userbal);
    }
    }catch(e){
      console.log('errr---', e)
    }
  };

  useEffect(() => {
    const connectWallet = async (walletType) => {
      try {
        await WalletProvider.login(walletType);
        const wallet = WalletProvider.getWallet();
        console.log("wallet----", wallet);
        if (!!wallet) {
          setUsername(wallet?.auth?.accountName);
          setwalletConnected(true);
          const tokens = await getTokens();
          if(tokens.length){
            await getBalance(tokens)
          }
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

  const connectToWallet = async () => {
    if (walletConnected) {
      try {
        const wallet = WalletProvider.getWallet();
        if (!!wallet) {
          await WalletProvider.disconnectWallet();
          localStorage.clear();
          setwalletConnected(false);
        }
      } catch (e) {
        console.log("something went wrong ", e);
      }
    } else {
      setShow(true);
      const tokens = await getTokens();
      if(tokens.length){
        await getBalance(tokens)
      }
    }
  };

  const handleRegister = async (values) => {
    try {
      setRegisterLoading(true);
      const eosAmount = 1;
      // await WalletProvider.login(walletType);
      const wallet = WalletProvider.getWallet();

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
            ],
          },
          {
            broadcast: true,
            blocksBehind: 3,
            expireSeconds: 60,
          }
        );
        if (result) {
          const { address } = values;
          console.log("address----", address);
          const result = await wallet.eosApi.transact(
            {
              actions: [
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
        }
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
    setRegisterLoading(true);
  };

  // getTokens();

  const handleTransfer = async (values) => {
    try {
      setLoading(true);
      let eosamout = 1;
      const { value, token } = values;
      console.log("data---", values);
      const wallet = WalletProvider.getWallet();

      if (!!wallet) {
        // const result = true
        const result = await wallet.eosApi.transact(
          {
            actions: [
              {
                account: "ddadlptoken1",
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
                  quantity: `${parseInt(value).toFixed(
                    parseInt(token.split(",")[0])
                  )} ${token.split(",")[1]} `,
                  memo: `Transfer ${token.split(",")[1]} token`,
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
          setLoading(false);
          setsuccessMsg("Transaction Success");
          seterrorMsg("");
        }
      }
    } catch (e) {
      console.log("error in treansferinng----", JSON.parse(JSON.stringify(e)));
      seterrorMsg(e.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="login">
        <div>{username}</div>
        {balances.map((balance) => (
          <div>{balance}</div>
        ))}
        <button className="loginbtn" onClick={connectToWallet}>
          {walletConnected ? "logout" : "connect"}
        </button>
      </div>
      <div className="login">
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
                  disabled={regstloading || loading}
                >
                  {regstloading ? "registering" : "Register"}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
        <div className="register">
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={handleTransfer}
          >
            <Form>
              <div>
                <Field name="value" placeholder="enter amount" />
              </div>
              <div>
                <ErrorMessage name="value" className="error" />
              </div>
              <div>
                <Field as="select" name="token">
                  {tokenSymbol.map((sym) => (
                    <option name="token" value={sym}>
                      {sym.split(",")[1]}
                    </option>
                  ))}
                  {/* <option value="USDC">USDC</option> */}
                </Field>
              </div>
              <div>
                <ErrorMessage name="token" className="error" />
              </div>
              <div>
                <button
                  type="submit"
                  className="registerbtn"
                  disabled={regstloading || loading}
                >
                  {loading ? "Sending Token" : "Send Token"}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
      {errorMsg ? (
        <div className="error">{errorMsg}</div>
      ) : (
        <div className="success">{successMsg}</div>
      )}
      {show ? (
        <Modal show={show}>
          <ConnectModal closeModal={closeModal} successModal={successModal} />
        </Modal>
      ) : null}
    </div>
  );
};

export default Eos;
