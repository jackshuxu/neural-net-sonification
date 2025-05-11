// src/utils/parseMat.js
export default function parseMat(text) {
  return text
    .trim()
    .split(/\r?\n/) // split on LF or CRLF
    .filter((line) => line) // drop empty lines
    .map((line, i) => {
      // split, trim each, then drop any empty strings
      const vals = line
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== "")
        .map((v) => parseFloat(v));

      if (vals.some((x) => Number.isNaN(x))) {
        throw new Error(`Invalid number at CSV row ${i + 1}`);
      }
      return vals;
    });
}
