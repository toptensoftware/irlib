import { protocolNec, generateIrSignal, decodeIrSignal, prontoPack, prontoUnpack, parseProntoFile } from "./index.js";

// Generate IR signal
let timing = generateIrSignal(protocolNec, 0x12345678, false);
console.log("Timing:", timing);

// Decode IR signal
let decoded = decodeIrSignal(timing);
console.log("Decoded:", decoded);

// Pack a pronto code
let pronto = prontoPack({
    carrierHz: 38000,
    intro: [1000, 2000, 1000, 2000],
    repeat: [4000, 2000, 4000, 2000],
})
console.log("Packed Pronto:", pronto);

// Unpack a pronto code
let code = prontoUnpack(pronto);
console.log("Unpacked Pronto", code);

let prontoFile = parseProntoFile("./demo.txt");
console.log("Parsed Prono File:", prontoFile);
