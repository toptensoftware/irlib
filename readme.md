# irlib

Node library for generating and decoding IR timing signals.

## Installation

```bash
npm install --save toptensoftware/irlib
```

## Usage

Example:

```js
import { protocolNec, generateIrSignal, decodeIrSignal } from "@toptensoftware/irlib";

// Generate IR signal
bool repeat = false;
let timing = generateIrSignal(protocolNec, 0x12345678, repeat);
console.log(timing);

// Decode IR signal
let decoded = decodeIrSignal(timing);
console.log(decoded);
```

produces:

```js
[
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
{ nec: '0x12345678' }
```


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.