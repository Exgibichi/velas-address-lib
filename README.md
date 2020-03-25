# Libraries for en/decoding address to velas/ether format

Functions arguments must be in string format with \ without prefixes "0x", "V"

## Encoding
To show user's address of his wallet, we take the address in the ether format and encode with the function `ethToVlx / EthToVlx / eth_to_vlx`

### Example
```
const addr = "0x32Be343B94f860124dC4fEe278FDCBD38C102D88";

console.log ("Encoded address:", ethToVlx (addr)); // Vi18WoPnMwQgcnqKKEuEEtaA51R9
```

## Decoding
To send user's transactions, we take the address in velas format and decode with the function `vlxToEth / VlxToEth / vlx_to_eth`

### Example
```
const addr = "Vi18WoPnMwQgcnqKKEuEEtaA51R9";

console.log ("Decoded address:", vlxToEth (addr)); // 0x32Be343B94f860124dC4fEe278FDCBD38C102D88
```
