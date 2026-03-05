import { allProtocols } from "./protocols.js";

export function makeIrProtocolDecoder(protocol)
{
    let state = "initial";
    let data = 0;
    return function (pulse, length, callback)
    {
        if (pulse === undefined)
        {
            state = "initial";
            return;
        }

        switch (state)
        {
            case "initial":
                if (pulse && match(length, protocol.header[0]))
                {
                    state = "have_header_pulse";
                }
                break;

            case "have_header_pulse":
                if (!pulse && match(length, protocol.header[1]))
                {
                    state = "start_bit";
                    data = [];
                }
                else
                    state = "initial";
                break;

            case "start_bit":
                if (pulse && data.length == protocol.bitCount)
                {
                    let dec = bitsToHex(data);
                    callback?.(dec, protocol);
                    //console.log("Decoded!", dec);
                    state = "initial";
                }
                if (pulse)
                {
                    if (match(length, protocol.one[0]))
                    {
                        if (match(length, protocol.zero[0]))
                            state = "in_either_bit";
                        else
                            state = "in_1_bit";
                    }
                    else if (match(length, protocol.zero[0]))
                    {
                        state = "in_0_bit";
                    }
                    else
                    {
                        state = "initial";
                    }
                }
                else
                    state = "initial";
                break;

            case "in_either_bit":
                if (!pulse && match(length, protocol.one[1]))
                {
                    data.push(1);
                    state = "start_bit";
                }
                else if (!pulse && match(length, protocol.zero[1]))
                {
                    data.push(0);
                    state = "start_bit";
                }
                else
                {
                    state = "initial";
                }
                break;

            case "in_1_bit":
                if (!pulse && match(length, protocol.one[1]))
                {
                    data.push(1);
                    state = "start_bit";
                }
                else
                {
                    state = "initial";
                }
                break;

            case "in_0_bit":
                if (!pulse && match(length, protocol.zero[1]))
                {
                    data.push(0);
                    state = "start_bit";
                }
                else
                {
                    state = "initial";
                }
                break;
        }
    }

    function match(length, required)
    {
        if (isNaN(length))
            return false;
        return length >= required * 0.6 && length <= required * 1.4;
    }

    function bitsToHex(bits)
    {
        while ((bits.length % 4) != 0)
            bits.unshift(0);

        let str = "0x";
        while (bits.length)
        {
            let nibble = 0;
            for (let i = 0; i < 4; i++)
            {
                nibble = (nibble << 1) | bits.shift();
            }
            str += nibble.toString(16);
        }
        return str;
    }
}


export function makeIrProtocolRepeatDecoder(protocol)
{
    let state = "expect-pulse";
    let pos = 0;
    return function (pulse, length, callback)
    {
        if (pulse === undefined)
        {
            state = "initial";
            return;
        }

        switch (state)
        {
            case "expect-pulse":
                if (pulse && match(length, protocol.repeat[pos]))
                {
                    state = "expect-space";
                    pos++;
                    if (pos == protocol.repeat.length - 1)
                    {
                        callback("repeat", protocol);
                        pos = 0;
                        state = "expect-pulse";
                    }
                }
                break;

            case "expect-space":
                if (!pulse && match(length, protocol.repeat[pos]))
                {
                    state = "expect-pulse";
                    pos++;
                }
                else
                {
                    state = "expect-pulse";
                    pos = 0;
                }
                break;
        }
    }

    function match(length, required)
    {
        if (isNaN(length))
            return false;
        return length >= required * 0.6 && length <= required * 1.4;
    }
}



export function decodeIrSignal(timing, protocols)
{
    // Default protocols?
    if (!protocols)
        protocols = allProtocols;

    // Create decoders for each protocol (both for the main code and for repeat)
    let decoders = [
        ...protocols.map(x => makeIrProtocolDecoder(x)),
        ...protocols.filter(x => x.repeat).map(x => makeIrProtocolRepeatDecoder(x))
    ];

    // Decode using all protocols
    let r = {};
    let pulse = true;
    for (let t of timing)
    {
        for (let i=0; i<decoders.length; i++)
        {
            decoders[i](pulse, t, (val, protocol) => r[protocol.name] = val);
        }
        pulse = !pulse;
    }

    return r;
}


