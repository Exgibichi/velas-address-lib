const crypto = require("crypto");

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const ALPHABET_MAP = {};

for (let i = 0; i < ALPHABET.length; i++) {
  ALPHABET_MAP[ALPHABET.charAt(i)] = i;
}

const BASE = 58;

const BITS_PER_DIGIT = Math.log(BASE) / Math.log(2);

function decodedLen(n) {
  return Math.floor((n * BITS_PER_DIGIT) / 8);
}

function maxEncodedLen(n) {
  return Math.ceil(n / BITS_PER_DIGIT);
}

function sha256(string) {
  return crypto
    .createHash("sha256")
    .update(string)
    .digest("hex");
}

function ethToVlx(address_string) {
  const clean_address = address_string.replace(/^0x/i, "").toLowerCase();
  const checksum = sha256(sha256(clean_address)).substring(0, 8);

  const long_address = clean_address + checksum;
  buffer = Buffer.from(long_address, "hex");

  if (buffer.length === 0) {
    throw new Error('Invalid address')
  }

  let i,
    j,
    digits = [0];
  for (i = 0; i < buffer.length; i++) {
    for (j = 0; j < digits.length; j++) digits[j] <<= 8;

    digits[0] += buffer[i];

    let carry = 0;
    for (j = 0; j < digits.length; ++j) {
      digits[j] += carry;

      carry = (digits[j] / BASE) | 0;
      digits[j] %= BASE;
    }

    while (carry) {
      digits.push(carry % BASE);

      carry = (carry / BASE) | 0;
    }
  }

  const zeros = maxEncodedLen(buffer.length * 8) - digits.length - 1;
  for (let i = 0; i < zeros; i++) digits.push(0);

  return (
    "V" +
    digits
      .reverse()
      .map(function(digit) {
        return ALPHABET[digit];
      })
      .join("")
  );
}

function vlxToEth(address_string) {
  if (address_string.length === 0) return null;
  string = address_string.replace("V", "");
  var i,
    j,
    bytes = [0];
  for (let i = 0; i < string.length; i++) {
    const c = string[i];
    if (!(c in ALPHABET_MAP)) throw new Error("Non-base58 character");

    for (j = 0; j < bytes.length; j++) bytes[j] *= BASE;
    bytes[0] += ALPHABET_MAP[c];

    let carry = 0;
    for (let j = 0; j < bytes.length; ++j) {
      bytes[j] += carry;

      carry = bytes[j] >> 8;
      bytes[j] &= 0xff;
    }

    while (carry) {
      bytes.push(carry & 0xff);

      carry >>= 8;
    }
  }

  const zeros = decodedLen(string.length) - bytes.length;

  for (let i = 0; i < zeros; i++) {
    bytes.push(0);
  }

  const long_address = Buffer.from(bytes.reverse()).toString("hex");
  const strings = long_address.match(/([0-9abcdef]+)([0-9abcdef]{8})/);

  if (strings.length !== 3) {
    throw new Error("Invalid address");
  }

  const checksum = sha256(sha256(strings[1])).substring(0, 8);

  if (strings[2] !== checksum) {
    throw new Error("Invalid checksum");
  }



  return "0x" + strings[1];
}

const addr = "0x32Be343B94f860124dC4fEe278FDCBD38C102D88";
const encaddr = "V5dJeCa7bmkqmZF53TqjRbnB4fG6hxuu4f";

console.log({ e: ethToVlx(addr) });
console.log({ d: vlxToEth(ethToVlx(addr)) });
console.log({ d: vlxToEth(encaddr) });
console.log({ valid: vlxToEth(ethToVlx(addr)) === addr.toLowerCase() });
