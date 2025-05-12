# Neural Network Sonification & Visualization

## Statement

In this project, I'm exploring how even a very minimal neural network, trained simply to recognize handwritten digits, can interact meaningfully with sound. Using a basic React frontend, you can draw digits or shapes directly onto the canvas, and these visuals immediately influence the neural network's activations in real-time. Those activations are then sent over to SuperCollider using Open Sound Control (OSC) to create simple, minimalist sonic responses.

Each neural network layer contributes something different to the sound. The hidden layers produce ambient pads, turning the neural activity into gentle tonal textures, where each neuron's position in the array sets the pitch and its activation strength determines how loud it plays. Meanwhile, the output layer, which shows the digit the network thinks you're drawing, triggers sparse bell tones. It also sends monophonic control voltages to a Serge synthesizer, changing the pitch of the oscillator.

The project's design emphasizes exploration and intuition. Users interact with the neural network by drawing, influencing both visual and auditory outcomes simultaneously. Intriguingly, as drawings become ambiguous, the resulting audio-visual output decreases in intensity, highlighting moments of uncertainty and error within the network. These inaccuracies introduce elements of surprise and unpredictability, enriching the user's sensory experience and underscoring the neural network's inherent interpretive nature.

For me, this project is a memory of a good old-fashioned AI, designed to do one simple task: recognize digits, albeit poorly.

---

This repository contains a web-based demo that:

1. **Draws** MNIST-style digits on a canvas (React).
2. **Feeds** the down-sampled input into a simple 2-hidden-layer neural network (TensorFlow\.js).
3. **Visualizes** the activations of each layer in 3D (React + react-three-fiber).
4. **Streams** activation data via OSC (Node.js gateway).
5. **Sonifies** the network’s hidden and output activations as ambient pads and melodies in SuperCollider, quantized to C minor.

---

## Features

- **Interactive drawing** with pencil/eraser modes and clear button.
- **Activation display** panel showing `hidden1`, `hidden2`, and `output` arrays in real time.
- **3D network visualization** of activations using Three.js.
- **OSC gateway** (`server.js`) forwarding activations to SuperCollider.
- **SuperCollider patch** that maps activations to musical notes in C minor at 40 BPM.

---

## Repo Structure

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

---

## Installation

1. **Clone** the repo:

   ```bash
   git clone https://github.com/your-username/nn-visualization.git
   cd nn-visualization
   ```

2. **Install** dependencies:

   ```bash
   npm install        # installs React app + server dependencies
   ```

3. **(Optional) Place** your `weight*.txt` and `biases*.txt` files into `public/weights/`.

---

## Running the Demo

1. **Start** the Node OSC gateway (port 3001):

   ```bash
   node server.js
   ```

2. **Launch** the React app (port 3000):

   ```bash
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Open** the SuperCollider patch `mlp_cminor_sonification.scd` in SuperCollider IDE:

   - Select all, press **⌘+Return** to boot the server and run the patch.
   - Open the Post window (**⌘+L**) to see OSC messages and beat ticks.

4. **Draw** a digit on the canvas.

   - The network will compute activations, visualize them, and send them to SuperCollider.
   - You’ll hear ambient pads (hidden layers) and a melodic lead (output) in C minor at 40 BPM.

---

## Troubleshooting

- **React errors**: ensure you’ve installed all dependencies.
- **CORS**: the Node gateway uses `cors({ origin: "http://localhost:3000" })`. Make sure your front-end runs on that origin.
- **OSC messages**: check the SuperCollider Post window for logs.

---

## ENJOY!
