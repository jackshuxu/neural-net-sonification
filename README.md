# Neural Network Visualization & Sonification

This repository contains a web‑based demo that:

1. **Draws** MNIST‑style digits on a canvas (React).
2. **Feeds** the down‑sampled input into a simple 2‑hidden‑layer neural network (TensorFlow\.js).
3. **Visualizes** the activations of each layer in 3D (React + react‑three‑fiber).
4. **Streams** activation data via OSC (Node.js gateway).
5. **Sonifies** the network’s hidden and output activations as ambient pads and melodies in SuperCollider, quantized to C minor.

---

## 🚀 Features

- **Interactive drawing** with pencil/eraser modes and clear button.
- **Activation display** panel showing `hidden1`, `hidden2`, and `output` arrays in real time.
- **3D network visualization** of activations using Three.js.
- **OSC gateway** (`server.js`) forwarding activations to SuperCollider.
- **SuperCollider patch** that maps activations to musical notes in C minor at 120 BPM.

---

## 📁 Repo Structure

```
├── public
│   └── weights/          # (Optional) Place your weight1.txt, biases1.txt, etc. here
├── src
│   ├── components
│   │   ├── InputCanvas.js
│   │   ├── NetworkVis.js
│   │   └── ActivationDisplay.js
│   ├── hooks
│   │   └── useNetwork.js
│   ├── App.js
│   └── index.js
├── server.js              # Node.js OSC gateway
├── mlp_cminor_sonification.scd  # SuperCollider patch
└── package.json
```

> ⚠️ **Note:** If you wish to load your trained MNIST weight/bias files, place them in `public/weights/`. If those files are missing or expired, re‑upload them before starting the app.

---

## ⚙️ Installation

1. **Clone** the repo:

   ```bash
   git clone https://github.com/your‑username/nn‑visualization.git
   cd nn‑visualization
   ```

2. **Install** dependencies:

   ```bash
   npm install        # installs React app + server dependencies
   ```

3. **(Optional) Place** your `weight*.txt` and `biases*.txt` files into `public/weights/`.

---

## ▶️ Running the Demo

1. **Start** the Node OSC gateway (port 3001):

   ```bash
   node server.js
   ```

2. **Launch** the React app (port 3000):

   ```bash
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Open** the SuperCollider patch `mlp_sonification.scd` in SuperCollider IDE:

   - Select all, press **⌘+Return** to boot the server and run the patch.
   - Open the Post window (**⌘+L**) to see OSC messages and beat ticks.

4. **Draw** a digit on the canvas.

   - The network will compute activations, visualize them, and send them to SuperCollider.
   - You’ll hear ambient pads (hidden layers) and a melodic lead (output) in C minor at 120 BPM.

---

## 🛠️ Customization

- **Brush size**: adjust the `ctx.arc(..., radius, ...)` in `InputCanvas.js`.
- **Sonification tempo**: modify `TempoClock.default.tempo` in the SuperCollider patch.
- **Scale**: change the `cMinor` array in `mlp_cminor_sonification.scd` to any other scale degrees.
- **Network architecture**: edit `useNetwork.js` to load different model files or adjust layer sizes.

---

## 📝 Troubleshooting

- **React errors**: ensure you’ve installed all dependencies. If using icons, run `npm install react-icons`.
- **CORS**: the Node gateway uses `cors({ origin: "http://localhost:3000" })`. Make sure your front‑end runs on that origin.
- **OSC messages**: check the SuperCollider Post window for `— pad tick` and `/hidden1` logs.
- **Missing weight files**: re‑upload your `.txt` weight/bias files into `public/weights/` if you see loading errors.
