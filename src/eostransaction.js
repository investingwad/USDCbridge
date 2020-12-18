import { useState, useEffect } from "react";
import WalletProvider from "./walletProvider";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { useSelector } from 'react-redux'
import * as Yup from "yup";
//@ts-ignore
import EosApi from "eosjs-api";

const options = {
  httpEndpoint: "https://api.kylin.alohaeos.com",
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
  token: "6,EUSDC",
};


const EosTransaction = (props) => {
  const username = useSelector((state) => state.user.username)
  const walletConnected = useSelector((state) => state.user.walletConnected)
  const [balances, setUserBalances] = useState([]);
  const [tokenSymbol, setSymbols] = useState(["6,EUSDC"]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, seterrorMsg] = useState("");
  const [successMsg, setsuccessMsg] = useState("");

  const {loggedIn} = props;
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
 
  const getBalance = async (tokens, account) => {
    const userbal = [];
    try {
      if (tokens.length) {
        console.log("username----", account);
        for (const symbol of tokens) {
          const tokensData = {
            code: "etheosmultok",
            json: true,
            limit: 1000,
            scope: symbol.split(",")[1],
            table: "available",
            table_key: account,
          };
          const responses = await fetch(
            "https://api.kylin.alohaeos.com/v1/chain/get_table_rows",
            {
              method: "post",
              body: JSON.stringify(tokensData),
            }
          );

          const tokensdata = await responses.json();
          console.log("respose----", tokensdata);
          if (tokensdata.rows.length) {
            tokensdata.rows.map((row) => {
              if (row.account == account) {
                userbal.push(tokensdata.rows[0].balance);
              }
            });
          }
        }
        console.log("userbalance ---", userbal);
        setUserBalances(userbal);
      }
    } catch (e) {
      console.log("errr---", e);
      setUserBalances(userbal);
    }
  };

  useEffect(()=>{
    getTokens();
    const getbal = async()=>{
      const tokens = await getTokens();
      if(walletConnected && tokens.length){
        await getBalance(tokens, username);
      }
    }
    if(loggedIn){
     getbal()
    }
    if(!loggedIn){
      setUserBalances([])
    }
  }, [loggedIn])

  const handleTransfer = async (values) => {
    try {
      setLoading(true);
      const { value, token } = values;
      const wallet = WalletProvider.getWallet();
      if (!!wallet) {
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
      } else {
        setLoading(false);
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
      <div>3. Send Tokens EOS to Ethereum</div>
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
