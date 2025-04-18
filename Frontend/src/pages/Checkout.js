import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

const Checkout = () => {
  const [amount, setAmount] = useState("10.00");

  const createOrder = async () => {
    const { data } = await axios.post("http://localhost:5004/api/paypal/create-order", { amount });
    return data.orderID;
  };

  const captureOrder = async (orderID) => {
    await axios.post("http://localhost:5004/api/paypal/capture-order", { orderID });
    alert("Payment successful!");
  };

  return (
    <PayPalScriptProvider options={{ "client-id": "YOUR_PAYPAL_CLIENT_ID" }}>
      <div className="container">
        <h2>Checkout</h2>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <PayPalButtons createOrder={createOrder} onApprove={(data) => captureOrder(data.orderID)} />
      </div>
    </PayPalScriptProvider>
  );
};

export default Checkout;
