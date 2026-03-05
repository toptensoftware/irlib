import fs from "node:fs";

// Unpacks an array of pronto values into a IR timing structure,
// returning { carrierHz, intro: [], repeat: [] }
export function prontoUnpack(prontoArray)
{
    if (!Array.isArray(prontoArray))
    {
        throw new Error('Input must be an array of integers');
    }

    if (prontoArray.length < 4)
    {
        throw new Error('Pronto array too short');
    }

    const type = prontoArray[0];

    if (type !== 0x0000)
    {
        throw new Error(`Unsupported Pronto type: ${type.toString(16)}. Only raw (0000) supported.`);
    }

    // Convert to Hz
    const carrierHz = Math.round(4145146 / prontoArray[1]);

    // Number of burst pairs
    const introPairs = prontoArray[2];
    const repeatPairs = prontoArray[3];

    // Remaining pulse data
    const pulses = prontoArray.slice(4);

    if (pulses.length < introPairs + repeatPairs * 2)
    {
        throw new Error('Pulse data too short for declared intro/repeat pairs');
    }

    let carrierPeriod = 1 / carrierHz;

    // Each burst pair is two numbers: ON duration, OFF duration
    const intro = pulses.slice(0, introPairs * 2).map(pulsesToMicros);
    const repeat = pulses.slice(introPairs * 2, introPairs * 2 + repeatPairs * 2).map(pulsesToMicros);

    return {
        carrierHz,
        intro,
        repeat,
    };

    function pulsesToMicros(x)
    {
        return Math.round(x * carrierPeriod * 1000000);
    }
}

// Packs a pronto code
// code.intro = [] timing array
// code.repeat = [] timing array
// code.carrierHz = carrier frequency
export function prontoPack(code)
{
    if ((code.intro.length % 2) != 0)
        throw new Error("intro length not a multiple of two")

    let rep = code.repeat ?? [];
    if ((rep.length % 2) != 0)
        throw new Error("repeat length not a multiple of two")

    let carrierPeriod = 1 / code.carrierHz;

    // Full pronto format
    return [ 
        0,  // raw timing
        Math.round(4145146 / code.carrierHz),
        code.intro.length / 2, 
        rep.length / 2, 
        ...code.intro.map(microsToPulses), 
        ...rep.map(microsToPulses)
    ];

    function microsToPulses(micros)
    {
        return Math.round((micros / 1000000) / carrierPeriod);
    }
}



export function parseProntoText(text)
{
    const result = [];
    let currentSection = null;

    const lines = text.split(/\r?\n/);

    for (let rawLine of lines)
    {
        const line = rawLine.trim();

        // Skip empty lines
        if (!line) continue;

        // Skip comments
        if (line.startsWith('#') || line.startsWith('//') || line.startsWith(';')) 
            continue;

        // Section header
        const sectionMatch = line.match(/^\[(.+?)\]$/);
        if (sectionMatch)
        {
            currentSection = {
                name: sectionMatch[1].trim(),
                deviceIndex: result.length,
                codes: [],
            }
            result.push(currentSection);
            continue;
        }

        // Key = Value
        const kvMatch = line.match(/^([^=]+)=(.+)$/);
        if (kvMatch)
        {
            if (!currentSection)
            {
                throw new Error(`Key/value found outside section: ${line}`);
            }

            const key = kvMatch[1].trim();
            const value = kvMatch[2].trim();

            currentSection.codes.push({name: key, ...prontoUnpack(value
                .split(/\s+/)
                .map(v => parseInt(v, 16))) 
            });
            continue;
        }

        // If we reach here, line is invalid
        throw new Error(`Invalid line: ${line}`);
    }

    return result;
}

export function parseProntoFile(filename)
{
    let text = fs.readFileSync(filename, "utf8");
    return parseProntoText(text);
}
