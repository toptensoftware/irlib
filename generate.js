export function generateIrSignal(protocol, code, repeat)
{
    if (repeat && protocol.repeat)
        return protocol.repeat;

    let bits = hexToBits(code, protocol.bitCount);

    let result = [...protocol.header, ...generatePulses(bits, protocol.one, protocol.zero), ...protocol.footer];

    if (protocol.length !== undefined)
    {
        let dataLen = result.reduce((a, b) => a + b, 0);
        if (dataLen < protocol.length)
            result.push(protocol.length - dataLen);
    }

    return result;


    function hexToBits(hexCode, numBits)
    {

        if (!numBits)
            return [];

        // Convert number to hex
        if (typeof (hexCode) == 'number')
            hexCode = hexCode.toString(16);

        // Remove 0x prefix if present
        let hex = hexCode.toLowerCase();
        if (hex.startsWith('0x'))
        {
            hex = hex.slice(2);
        }

        const bits = [];

        // Convert each hex digit to 4 bits
        for (const digit of hex)
        {
            const value = parseInt(digit, 16);
            bits.push((value >> 3) & 1);
            bits.push((value >> 2) & 1);
            bits.push((value >> 1) & 1);
            bits.push(value & 1);
        }

        // Pad with leading zeros or trim to match numBits
        if (bits.length < numBits)
        {
            const padding = new Array(numBits - bits.length).fill(0);
            return [...padding, ...bits];
        } else if (bits.length > numBits)
        {
            return bits.slice(bits.length - numBits);
        }

        return bits;
    }

    function generatePulses(bits, onePulse, zeroPulse)
    {
        let r = [];
        for (let bit of bits)
        {
            if (bit)
                r.push(...onePulse);
            else
                r.push(...zeroPulse);
        }
        return r;
    }
}

