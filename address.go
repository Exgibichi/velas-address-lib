package main

import (
	"encoding/hex"
	"fmt"
	"math/big"
	"os"
	"strings"

	"github.com/itchyny/base58-go"
)

func ethToVlx(address string) (encoded string) {
	strippedAddressHex := strings.Replace(string(address), "0x", "", 1)
	decodedHex, err1 := hex.DecodeString(strippedAddressHex)
	if err1 != nil {
		fmt.Println(err1.Error())
		os.Exit(1)
	}
	bigInt := new(big.Int).SetBytes(decodedHex)
	encoding := base58.BitcoinEncoding
	encodedAddress, err := encoding.Encode([]byte(bigInt.String()))
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}
	return "V" + string(encodedAddress)
}

func vlxToEth(address string) (encoded string) {
	strippedAddress := strings.Replace(address, "V", "", 1)
	encoding := base58.BitcoinEncoding
	decodedAddress, err := encoding.Decode([]byte(strippedAddress))
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}
	bigInt, biErr := new(big.Int).SetString(string(decodedAddress), 10)
	if !biErr {
		fmt.Println("invalid address can`t convert")
		os.Exit(1)
	}
	hexAddress := fmt.Sprintf("%x", bigInt)
	return "0x" + hexAddress
}

func main() {
	address := "0x32Be343B94f860124dC4fEe278FDCBD38C102D88"
	encoded := ethToVlx(address)
	decoded := vlxToEth(encoded)

	fmt.Println(encoded)
	fmt.Println(decoded)
}
