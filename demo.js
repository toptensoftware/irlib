import { protocolNec, generateIrSignal, decodeIrSignal } from "./index.js";

// Generate IR signal
let timing = generateIrSignal(protocolNec, 0x12345678, true);
console.log(timing);

// Decode IR signal
let decoded = decodeIrSignal(timing);
console.log(decoded);
