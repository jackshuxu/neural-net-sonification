// server.js (CommonJS)
const express = require("express");
const bodyParser = require("body-parser");
const { UDPPort } = require("osc");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json({ limit: "2mb" }));

// Listen for HTTP on 3001, send OSC to SC on 57120
const oscPort = new UDPPort({
  localAddress: "0.0.0.0",
  localPort: 57130, // your gateway’s own OSC port (can be anything)
  remoteAddress: "127.0.0.1",
  remotePort: 57120, // SuperCollider’s default OSC port
});
oscPort.open();

app.post("/activations", (req, res) => {
  // pull in the original arrays
  let { hidden1, hidden2, output } = req.body;

  // helper to round to 0.01
  const round2 = (arr) => arr.map((v) => Math.round(v * 100) / 100);

  // quantize _in place_
  hidden1 = round2(hidden1);
  hidden2 = round2(hidden2);
  output = round2(output);

  // log the quantized arrays
  console.log("→ Received (rounded to .01):");
  console.log("   hidden1:", JSON.stringify(hidden1));
  console.log("   hidden2:", JSON.stringify(hidden2));
  console.log("   output :", JSON.stringify(output));

  // send the same quantized arrays over OSC
  oscPort.send({
    address: "/hidden1",
    args: hidden1.map((v) => ({ type: "f", value: v })),
  });
  oscPort.send({
    address: "/hidden2",
    args: hidden2.map((v) => ({ type: "f", value: v })),
  });
  oscPort.send({
    address: "/output",
    args: output.map((v) => ({ type: "f", value: v })),
  });

  console.log("→ OSC sent to port 57120");
  res.sendStatus(200);
});

app.listen(3001, () => {
  console.log("Gateway up on http://localhost:3001");
});
