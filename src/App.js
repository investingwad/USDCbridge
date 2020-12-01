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
  value: 1,
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

      if (!!ethereum) {
        const accounts = await ethereum.enable();

        setAddress(accounts[0]);
      }

      // console.log('ethereum ', ethereum)

      console.log("current provider ", Web3.givenProvider);
    } catch (e) {
      console.log("something went wrong ", e);
    }
  };

  const handleSubmit = async (values) => {
    console.log("inside handle submit ", values);

    console.log("address ", address);

    const { value } = values;
    console.log("value ", parseInt(value));

    const gasPrice = await web3.eth.getGasPrice();

    setLoading(true);

    usdcContract.methods
      .approve(bridgeAddress, parseInt(values.value))
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
          .sendToken(parseInt(values.value))
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

  console.log("address ", address);

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
              <Field name="value" />
            </div>
            <div>
              <ErrorMessage name="value" />
            </div>
            <div>
              <Field as="select" name="token">
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
                <option value="DAI">DAI</option>
              </Field>
            </div>
            <div>
              <ErrorMessage name="token" />
            </div>
            <div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Submitting" : "Submit"}
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default App;
