// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // ← import cors
const { UDPPort } = require("osc");

const app = express();

// 1) Enable CORS for all origins (or restrict to http://localhost:3000)
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(bodyParser.json({ limit: "2mb" }));

const oscPort = new UDPPort({
  localAddress: "0.0.0.0",
  localPort: 57120,
  remoteAddress: "127.0.0.1",
  remotePort: 57110,
});
oscPort.open();

app.post("/activations", (req, res) => {
  const { hidden1, hidden2, output } = req.body;
  console.log("→ Received activations:", {
    hidden1: hidden1.length,
    hidden2: hidden2.length,
    output: output.length,
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

  console.log("→ OSC messages sent");
  res.sendStatus(200);
});

app.listen(3001, () => {
  console.log("OSC gateway listening on http://localhost:3001");
});
