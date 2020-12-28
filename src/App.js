import * as Web3 from "web3";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  usdcAddress,
  bridgeAbi,
  bridgeAddress,
  daiAddress,
  tokenAbi,
  dappBrigeAbi,
  dappBrigeAddress,
} from "./abi";
import { useState } from "react";

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
const dappContract = new web3.eth.Contract(dappBrigeAbi, dappBrigeAddress);

const App = () => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState("");
  const [checked, setChecked] = useState(false);

  const sendToken = async (stakeAMount, tokenId) => {
    console.log("inside send token");

    setLoading(true);

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
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        console.log("confirmationNumber sendToken", confirmationNumber);
        console.log("receipt sendToken", receipt);
      })
      .on("error", (error) => {
        console.log("error sendToken", error);
        setLoading(false);
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
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        console.log("confirmationNumber approve", confirmationNumber);
        console.log("receipt approve", receipt);
      })
      .on("error", (error) => {
        console.log("error approve", error);
        setLoading(false);
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
          })
          .on("confirmation", (confirmationNumber, receipt) => {
            console.log("confirmationNumber sendToken", confirmationNumber);
            console.log("receipt sendToken", receipt);
          })
          .on("error", (error) => {
            console.log("error sendToken", error);
            setLoading(false);
          });
      });
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
        }
      } else {
        alert("Please select Ropsten test network then connect");
      }
    } catch (e) {
      console.log("something went wrong ", e);
    }
  };

  const handleSubmit = async (values) => {
    console.log("values ", values);

    if (!address) {
      alert("Please connect to metamask first");
      return;
    }

    const { value, token } = values;

    console.log("value ", value);

    console.log("token ", token);

    if (token === "DAPP") {
      setLoading(true);

      dappContract.methods
        .sendToken((parseFloat(value) * 1e4).toString())
        .send({
          from: address,
        })
        .on("transactionHash", (hash) => {
          console.log("transactionHash  sendToken", hash);
        })
        .on("receipt", (receipt) => {
          console.log("receipt sendToken", receipt);

          setLoading(false);
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          console.log("confirmationNumber sendToken", confirmationNumber);
          console.log("receipt sendToken", receipt);
        })
        .on("error", (error) => {
          console.log("error sendToken", error);
          setLoading(false);
        });
    } else {
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
    }
  };

  console.log("checked ", checked);

  return (
    <div className="form-container">
      <button onClick={connectToMetamask}>
        {!!address ? "Connected" : "Connect to metamask"}
      </button>

      <div>
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
                <option value="DAPP">DAPP</option>
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

      <a
        href="https://docs.google.com/document/u/1/d/14K6_DT-pqmBsAd3tLoHD-SKhPO1WCFW7unMKTMzxKx4/edit?usp=sharing"
        target="_blank"
        rel="noreferrer"
      >
        Click here for help
      </a>
    </div>
  );
};

export default App;
