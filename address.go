package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"regexp"
	"strings"

	"github.com/pkg/errors"

	"github.com/btcsuite/btcutil/base58"
)

func main() {
	eth := "0x32Be343B94f860124dC4fEe278FDCBD38C102D88"
	vel := "V5dJeCa7bmkqmZF53TqjRbnB4fG6hxuu4f"

	encoded, err := EthToVlx(eth)
	if err != nil {
		panic(err)
	}

	decoded, err := VlxToEth(vel)
	if err != nil {
		panic(err)
	}

	if encoded == vel && decoded == strings.ToLower(eth) {
		fmt.Println("success")
	}
}

func EthToVlx(address string) (string, error) {
	strippedAddressHex := strings.ToLower(strings.TrimPrefix(address, "0x"))

	checksum := sha(sha(strippedAddressHex))[:8]
	raw := strippedAddressHex + checksum

	dec, err := hex.DecodeString(raw)
	if err != nil {
		return "", errors.Wrap(err, "failed to decode long address")
	}

	result := "V" + base58.Encode(dec)
	return result, nil
}

func VlxToEth(address string) (string, error) {
	clean := strings.TrimPrefix(address, "V")
	decodedAddress := hex.EncodeToString(base58.Decode(clean))

	regex := regexp.MustCompile(`([0-9abcdef]+)([0-9abcdef]{8})`)
	if !regex.MatchString(decodedAddress) {
		return "", errors.New("invalid decoded address")
	}

	strings := regex.FindStringSubmatch(decodedAddress)

	if len(strings) != 3 {
		return "", errors.New("invalid address")
	}

	checksum := sha(sha(strings[1]))[:8]

	if strings[2] != checksum {
		return "", errors.New("invalid checksum")
	}

	return "0x" + strings[1], nil
}

func sha(raw string) string {
	hasher := sha256.New()
	hasher.Write([]byte(raw))
	return hex.EncodeToString(hasher.Sum(nil))
}
