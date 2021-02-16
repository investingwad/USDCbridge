import * as Web3 from "web3";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  usdcAddress,
  bridgeAbi,
  bridgeAddress,
  daiAddress,
  tokenAbi,
} from "./abi";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Docs } from "./config";

const web3 = new Web3(Web3.givenProvider);

const schema = Yup.object().shape({
  value: Yup.number()
    .required("Enter value of token")
    .test(
      "lowAmount",
      `Should be greater than 0`,
      (val) => parseFloat(val) > 0
    ),
  token: Yup.string().required("Select a token type"),
});

const initialValues = {
  value: "",
  token: "USDC",
};

const usdcContract = new web3.eth.Contract(tokenAbi, usdcAddress);
const daiContract = new web3.eth.Contract(tokenAbi, daiAddress);
const brigeContract = new web3.eth.Contract(bridgeAbi, bridgeAddress);

const Ethereum = () => {
  const walletConnected = useSelector((state) => state.user.walletConnected);
  const address = useSelector((state) => state.address.address);
  const ethwalletConnected = useSelector(
    (state) => state.address.ethWalletConnected
  );
  const [loading, setLoading] = useState("");
  const [checked, setChecked] = useState(false);
  const [errorMsg, seterrorMsg] = useState("");
  const [successMsg, setsuccessMsg] = useState("");
  const [approvedMsg, setapprovedMsg] = useState("");

  const sendToken = async (stakeAMount, tokenId) => {
    brigeContract.methods
      .sendToken(stakeAMount, tokenId)
      .send({
        from: address,
      })
      .on("transactionHash", (hash) => {
        console.log("transactionHash  sendToken", hash);
      })
      .on("receipt", (receipt) => {
        console.log("receipt sendToken", receipt);
        setLoading(false);
        setsuccessMsg(receipt.transactionHash);
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        console.log("confirmationNumber sendToken", confirmationNumber);
        console.log("receipt sendToken", receipt);
      })
      .on("error", (error) => {
        console.log("error sendToken", error);
        setLoading(false);
        seterrorMsg(error.message);
      });
  };

  const approveAndSendToken = async (stakeAMount, tokenId, token) => {
    console.log("inside approve and send token");

    setLoading(true);

    const contract = token === "USDC" ? usdcContract : daiContract;

    let approvedAmount = "";

    if (checked) {
      approvedAmount =
        token === "USDC"
          ? web3.utils.toWei("10000000000000000", "mwei")
          : web3.utils.toWei("10000000000000000", "ether");
    } else {
      approvedAmount = stakeAMount;
    }

    console.log("approved amount ", approvedAmount);

    contract.methods
      .approve(bridgeAddress, approvedAmount)
      .send({
        from: address,
      })
      .on("transactionHash", (hash) => {
        console.log("transactionHash approve ", hash);
      })
      .on("receipt", (receipt) => {
        console.log("receipt approve", receipt);
        setapprovedMsg(receipt.transactionHash);
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        console.log("confirmationNumber approve", confirmationNumber);
        console.log("receipt approve", receipt);
      })
      .on("error", (error) => {
        console.log("error approve", error);
        setLoading(false);
        seterrorMsg(error.message);
      })
      .then(() => {
        brigeContract.methods
          .sendToken(stakeAMount, tokenId)
          .send({
            from: address,
          })
          .on("transactionHash", (hash) => {
            console.log("transactionHash  sendToken", hash);
          })
          .on("receipt", (receipt) => {
            console.log("receipt sendToken", receipt);
            setLoading(false);
            setsuccessMsg(receipt.transactionHash);
          })
          .on("confirmation", (confirmationNumber, receipt) => {
            console.log("confirmationNumber sendToken", confirmationNumber);
            console.log("receipt sendToken", receipt);
          })
          .on("error", (error) => {
            console.log("error sendToken", error);
            setLoading(false);
            seterrorMsg(error.message);
          });
      });
  };

  const handleSubmit = async (values) => {
    console.log("values ", values);

    if (!address) {
      alert("Please connect to metamask first");
      return;
    }

    const { value, token } = values;

    console.log("value ", value);

    const tokenId = token === "USDC" ? 0 : 1;

    const contract = token === "USDC" ? usdcContract : daiContract;

    const stakeAMount =
      token === "USDC"
        ? web3.utils.toWei(value, "mwei")
        : web3.utils.toWei(value, "ether");

    console.log("stakeAMount ", stakeAMount);

    const approvedAmount = await contract.methods
      .allowance(address, bridgeAddress)
      .call();

    console.log("approvedAmount in contract ", approvedAmount);

    if (approvedAmount > stakeAMount) {
      sendToken(stakeAMount, tokenId);
    } else {
      approveAndSendToken(stakeAMount, tokenId, token);
    }
  };

  const closeTab = () => {
    if (errorMsg) {
      seterrorMsg("");
    }
    if (successMsg) {
      setsuccessMsg("");
    }
    if (approvedMsg) {
      setapprovedMsg("");
    }
  };

  console.log("checked ", checked);

  return (
    <div className="form-container">
      <div>4. Send Tokens Ethereum to EOS</div>
      <div className="login">
        <div className="tokenform">
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            <Form>
              <div>
                <Field name="value" placeholder="enter amount" />
              </div>
              <div>
                <ErrorMessage name="value" />
              </div>
              <div>
                <Field as="select" name="token">
                  <option value="USDC">USDC</option>
                  <option value="DAI">DAI</option>
                </Field>
              </div>
              <div>
                <ErrorMessage name="token" />
              </div>
              <label>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                  disabled={loading}
                />
                <span>Infinite Approval</span>
              </label>
              <div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Sending Token" : "Send Token"}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>

      <a href={Docs.Ethdoc} target="_blank" rel="noreferrer">
        Click here for help
      </a>

      {errorMsg ? (
        <div className="errorMsg">
          <div className="close" onClick={closeTab}>
            x
          </div>
          <div className="errmsg">Error</div>
          <p className="error">{errorMsg}</p>
        </div>
      ) : successMsg ? (
        <div className="successMsg">
          <div className="close" onClick={closeTab}>
            x
          </div>
          <div className="msg">Success</div>
          {approvedMsg ? (
            <>
              <p className="para">
                Check approved trx :
                <a
                  href={`https://etherscan.io/tx/${approvedMsg}`}
                  className="link"
                >
                  {approvedMsg}
                </a>
              </p>

              <p className="para">
                Check deposit trx :
                <a href={successMsg} className="link">
                  {successMsg}
                </a>
              </p>
            </>
          ) : (
            <>
              <div>Check transaction :</div>
              <a
                href={`https://etherscan.io/tx/${successMsg}`}
                className="link"
              >
                {successMsg}
              </a>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Ethereum;
