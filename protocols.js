export let protocolNec = {
    name: "nec",
    bitCount: 32,
    length: 108000,
    header: [9000, 4500],
    footer: [562],
    one: [562, 1675],
    zero: [562, 562],
    repeat: [9000, 2250, 562, 108000 - 9000 - 2250 - 562]
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