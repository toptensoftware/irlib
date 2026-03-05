# irlib

Node library for generating and decoding IR timing signals.

Also, includes helpers for packing and unpacking pronto data and parsing plain text pronto files.

## Installation

```bash
npm install --save toptensoftware/irlib
```

## Usage

Example:

```js
import { protocolNec, generateIrSignal, decodeIrSignal, prontoPack, prontoUnpack } from "@toptensoftware/irlib";

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

// Parse a pronto .txt file
let prontoFile = parseProntoFile("./demo.txt");
console.log("Parsed Prono File:", prontoFile);

```

produces:

```txt
Timing: [
  9000, 4500, 560,  1125, 560, 1125, 560, 1125,
   560, 2250, 560,  1125, 560, 1125, 560, 2250,
   560, 1125, 560,  1125, 560, 1125, 560, 2250,
   560, 2250, 560,  1125, 560, 2250, 560, 1125,
   560, 1125, 560,  1125, 560, 2250, 560, 1125,
   560, 2250, 560,  1125, 560, 2250, 560, 2250,
   560, 1125, 560,  1125, 560, 2250, 560, 2250,
   560, 2250, 560,  2250, 560, 1125, 560, 1125,
   560, 1125, 560, 25395
]
Decoded: { nec: '0x12345678' }
Packed Pronto: [
    0, 109,  2,   2, 38,
   76,  38, 76, 152, 76,
  152,  76
]
Unpacked Pronto {
  carrierHz: 38029,
  intro: [ 999, 1998, 999, 1998 ],
  repeat: [ 3997, 1998, 3997, 1998 ]
}
Parsed Prono File: [
  { name: 'yama', deviceIndex: 0, codes: [ [Object], [Object] ] },
  { name: 'pana', deviceIndex: 1, codes: [ [Object], [Object] ] }
]
```


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.