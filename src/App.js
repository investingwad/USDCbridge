import * as Web3 from "web3";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { usdcAbi, usdcAddress, bridgeAbi, bridgeAddress } from "./abi";
import { useState } from "react";

const web3 = new Web3(Web3.givenProvider);

const schema = Yup.object().shape({
  value: Yup.number()
    .required("Enter value of token")
    .test("lowAmount", `Should be greater than 0`, (val) => parseInt(val) > 0),
  token: Yup.string().required("Select a token type"),
});

const initialValues = {
  value: "",
  token: "USDC",
};

const usdcContract = new web3.eth.Contract(usdcAbi, usdcAddress);
const brigeContract = new web3.eth.Contract(bridgeAbi, bridgeAddress);

const App = () => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState("");

  const connectToMetamask = async () => {
    try {
      console.log("connecting to metamask");

      const { ethereum } = window;

      console.log("ethereum ", ethereum);

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

    if(!address) {
      alert('Please connect to metamask first')
      return;
    }
    
    const { value } = values;

    const gasPrice = await web3.eth.getGasPrice();

    setLoading(true);

    usdcContract.methods
      .approve(bridgeAddress, parseInt(value))
      .send({
        from: address,
        gas: 450000,
        gasPrice,
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
          .sendToken(parseInt(value))
          .send({
            from: address,
            gas: 450000,
            gasPrice,
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
              </Field>
            </div>
            <div>
              <ErrorMessage name="token" />
            </div>
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
      >
        Click here for help
      </a>
    </div>
  );
};

export default App;
