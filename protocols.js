export let protocolNec = {
    name: "nec",
    bitCount: 32,
    length: 108000,
    header: [9000, 4500],
    footer: [560],
    one: [560, 2250],
    zero: [560, 1125],
    repeat: [9000, 2250, 560, 108000 - 9000 - 2250 - 560]
}

export let protocolPana = {
    name: "pana",
    bitCount: 48,
    header: [3500, 1750],
    footer: [435],
    one: [435, 1300],
    zero: [435, 435],
}


export let allProtocols = [ protocolNec, protocolPana ];