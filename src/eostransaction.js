import { useState, useEffect } from "react";
import WalletProvider from "./walletProvider";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
//@ts-ignore
import EosApi from "eosjs-api";
import { Actions, contracts, eosEndpoint, tables } from "./config";

const options = {
  httpEndpoint: eosEndpoint,
};
const eos = EosApi(options);

const schema = Yup.object().shape({
  value: Yup.number()
    .required("Enter value of token")
    .test("lowAmount", `Should be greater than 0`, (val) => parseInt(val) > 0),
  token: Yup.string().required("Select a token type"),
});

const initialValues = {
  value: "",
  token: "6,USDC",
};

const EosTransaction = (props) => {
  const username = useSelector((state) => state.user.username);
  const walletConnected = useSelector((state) => state.user.walletConnected);
  const ethwalletConnected = useSelector(
    (state) => state.address.ethWalletConnected
  );
  const [balances, setUserBalances] = useState([]);
  const [tokenSymbol, setSymbols] = useState(["4,USDC"]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, seterrorMsg] = useState("");
  const [successMsg, setsuccessMsg] = useState("");
  const [usdcfee, setUsdcFee] = useState("0.000000 USDC");
  const [daifee, setDaiFee] = useState("0.000000 DAI");

  const { loggedIn } = props;
  const getTokens = async () => {
    let tokens = [];
    const requests = await eos.getTableRows({
      code: contracts.BRIDGE_CON,
      scope: contracts.BRIDGE_CON,
      table: tables.Symbols,
      json: "true",
    });
    if (requests.rows.length) {
      requests.rows.map((row) => {
        tokens.push(row.dtoken.toString());
      });
    }
    setSymbols(tokens);
    return tokens;
  };

  const getBalance = async (tokens, account) => {
    const userbal = [];
    try {
      if (tokens.length) {
        for (const symbol of tokens) {
          let code;
          // let toAcc;
          code = contracts.TokenContract;
          const tokensData = {
            code: code,
            json: true,
            limit: 1000,
            scope: account,
            table: tables.Accounts,
            table_key: account,
          };
          const responses = await fetch(
            `${eosEndpoint}/v1/chain/get_table_rows`,
            {
              method: "post",
              body: JSON.stringify(tokensData),
            }
          );

          const tokensdata = await responses.json();

          if (tokensdata.rows.length) {
            const balanceRow = tokensdata.rows.find(
              (row) => row.balance.split(" ")[1] == symbol.split(",")[1]
            );
            userbal.push(balanceRow.balance);
          }
        }
        setUserBalances(userbal);
      }
    } catch (e) {
      setUserBalances(userbal);
    }
  };

  useEffect(() => {
    const getfees = async () => {
      const usdcreq = await eos.getTableRows({
        code: contracts.BRIDGE_CON,
        scope: "USDC",
        table: tables.FEE_TAB,
        json: "true",
      });
      const daireq = await eos.getTableRows({
        code: contracts.BRIDGE_CON,
        scope: "DAI",
        table: tables.FEE_TAB,
        json: "true",
      });
      if (usdcreq.rows.length) {
        const fee = await usdcreq.rows[0].minfeewithdraw;
        setUsdcFee(fee);
      }
      if (daireq.rows.length) {
        const fee = await daireq.rows[0].minfeewithdraw;
        setDaiFee(fee);
      }
    };
    getfees();
  }, []);

  useEffect(() => {
    getTokens();
    const getbal = async () => {
      const tokens = await getTokens();
      if (walletConnected && tokens.length) {
        await getBalance(tokens, username);
      }
    };
    if (loggedIn) {
      getbal();
    }
    if (!loggedIn) {
      setUserBalances([]);
    }
  }, [loggedIn]);

  const handleTransfer = async (values) => {
    try {
      const { value, token } = values;
      const wallet = WalletProvider.getWallet();
      if (!walletConnected) {
        seterrorMsg("Eos wallet is not connected");
      } else if (!ethwalletConnected) {
        seterrorMsg("Ethereum wallet is not connected");
      } else if (!!wallet) {
        setLoading(true);
        let account;
        let toAcc;
        account = contracts.TokenContract;
        toAcc = contracts.BRIDGE_CON;
        const result = await wallet.eosApi.transact(
          {
            actions: [
              {
                account: account,
                name: Actions.Transfer,
                authorization: [
                  {
                    actor: wallet.auth.accountName,
                    permission: wallet.auth.permission,
                  },
                ],
                data: {
                  from: wallet.auth.accountName,
                  to: toAcc,
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
      } else {
        setLoading(false);
      }
    } catch (e) {
      seterrorMsg(e.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div>5. Send Tokens EOS to Ethereum</div>
      <div className="login">
        <div className="register">
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={handleTransfer}
          >
            <Form>
              {balances.map((balance) => (
                <div className="userbalance">{balance}</div>
              ))}
              <div>
                <Field name="value" placeholder="enter amount" />
              </div>
              <div>
                <ErrorMessage name="value" className="error" />
              </div>
              <div>
                <Field as="select" name="token">
                  <option value="6,USDC">USDC</option>
                  <option value="6,DAI">DAI</option>
                </Field>
              </div>
              <div>
                <ErrorMessage name="token" className="error" />
              </div>
              <div className="notefee">
                Note: Current withdraw fee is {usdcfee} and {daifee} set
              </div>
              <div>
                <button
                  type="submit"
                  className="registerbtn"
                  disabled={loading}
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
    </div>
  );
};

export default EosTransaction;
