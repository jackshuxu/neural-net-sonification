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
  const { hidden1, hidden2, output } = req.body;
  console.log("→ Received:", {
    h1: hidden1.length,
    h2: hidden2.length,
    out: output.length,
  });

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
