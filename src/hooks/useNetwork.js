// src/hooks/useNetwork.js
import * as tf from "@tensorflow/tfjs";
import { useState, useEffect } from "react";
import parseMat from "../utils/parseMat";

export default function useNetwork(inputArray) {
  const [activations, setActivations] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAndRun() {
      try {
        const base = "/weights";
        const files = [
          "weight1.txt",
          "bias1.txt",
          "weight2.txt",
          "bias2.txt",
          "weight3.txt",
          "bias3.txt",
        ];

        // 1) Fetch & parse all six files
        const texts = await Promise.all(
          files.map((f) => fetch(`${base}/${f}`).then((r) => r.text()))
        );
        const [rawW1, rawB1, rawW2, rawB2, rawW3, rawB3] = texts.map(parseMat);

        // 2) Flatten biases to 1-D arrays
        const b1 = rawB1.flat();
        const b2 = rawB2.flat();
        const b3 = rawB3.flat();

        // 3) Helper to reshape a single-row weight into [rows][cols]
        function reshapeWeight(raw, rows, cols, name) {
          if (raw.length === 1) {
            const flat = raw[0];
            if (flat.length !== rows * cols) {
              throw new Error(
                `Unexpected number of weights in ${name}: got ${
                  flat.length
                }, expected ${rows * cols}`
              );
            }
            // slice into `rows` arrays of length `cols`
            return Array.from({ length: rows }, (_, i) =>
              flat.slice(i * cols, (i + 1) * cols)
            );
          } else {
            // already multi-line: validate shape
            if (raw.length !== rows || raw[0].length !== cols) {
              throw new Error(
                `Invalid shape for ${name}: got ${raw.length}×${raw[0].length}, expected ${rows}×${cols}`
              );
            }
            return raw;
          }
        }

        // 4) Determine dimensions
        const inputDim = inputArray.length; // 784
        const hidden1 = b1.length; // e.g. 128
        const hidden2 = b2.length; // e.g.  64
        const output = b3.length; // e.g.  10

        // 5) Reshape weights
        const w1 = reshapeWeight(rawW1, inputDim, hidden1, "weight1.txt");
        const w2 = reshapeWeight(rawW2, hidden1, hidden2, "weight2.txt");
        const w3 = reshapeWeight(rawW3, hidden2, output, "weight3.txt");

        // 6) Convert to tensors
        const x = tf.tensor2d([inputArray], [1, inputDim]);
        const tW1 = tf.tensor2d(w1);
        const tB1 = tf.tensor1d(b1);
        const tW2 = tf.tensor2d(w2);
        const tB2 = tf.tensor1d(b2);
        const tW3 = tf.tensor2d(w3);
        const tB3 = tf.tensor1d(b3);

        console.log(
          "Shapes:",
          x.shape,
          tW1.shape,
          tB1.shape,
          tW2.shape,
          tB2.shape,
          tW3.shape,
          tB3.shape
        );

        // 7) Forward pass
        const m1 = x.matMul(tW1).add(tB1).relu();
        const m2 = m1.matMul(tW2).add(tB2).relu();
        const logits = m2.matMul(tW3).add(tB3);
        const out = tf.softmax(logits);

        // 8) Extract arrays for visualization
        const input2d = x.reshape([28, 28]).arraySync();
        //console.log("input2d (first few rows):", input2d.slice(0, 3));
        const h1 = m1.arraySync()[0];
        const h2 = m2.arraySync()[0];
        const y = out.arraySync()[0];

        if (!cancelled) {
          setActivations({
            input: input2d,
            hidden1: h1,
            hidden2: h2,
            output: y,
          });
        }

        // 9) Clean up
        tf.dispose([x, tW1, tB1, tW2, tB2, tW3, tB3, m1, m2, logits, out]);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError(err.message);
      }
    }

    loadAndRun();
    return () => {
      cancelled = true;
    };
  }, [inputArray]);

  return { activations, error };
}
