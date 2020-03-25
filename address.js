var ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var ALPHABET_MAP = {};
for (var i = 0; i < ALPHABET.length; i++) {
  ALPHABET_MAP[ALPHABET.charAt(i)] = i;
}
var BASE = 58;

var BITS_PER_DIGIT = Math.log(BASE) / Math.log(2);

function decodedLen(n) {
  return Math.floor((n * BITS_PER_DIGIT) / 8);
}

function maxEncodedLen(n) {
  return Math.ceil(n / BITS_PER_DIGIT);
}

function ethToVlx(address_string) {
  buffer = Buffer.from(address_string.replace(/^0x/i, ""), "hex");
  if (buffer.length === 0) return "";

  var i,
    j,
    digits = [0];
  for (i = 0; i < buffer.length; i++) {
    for (j = 0; j < digits.length; j++) digits[j] <<= 8;

    digits[0] += buffer[i];

    var carry = 0;
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

  var zeros = maxEncodedLen(buffer.length * 8) - digits.length - 1;
  for (i = 0; i < zeros; i++) digits.push(0);

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

function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

function vlxToEth(address_string) {
  if (address_string.length === 0) return [];
  string = address_string.replace("V", "");
  var i,
    j,
    bytes = [0];
  for (i = 0; i < string.length; i++) {
    var c = string[i];
    if (!(c in ALPHABET_MAP)) throw new Error("Non-base58 character");

    for (j = 0; j < bytes.length; j++) bytes[j] *= BASE;
    bytes[0] += ALPHABET_MAP[c];

    var carry = 0;
    for (j = 0; j < bytes.length; ++j) {
      bytes[j] += carry;

      carry = bytes[j] >> 8;
      bytes[j] &= 0xff;
    }

    while (carry) {
      bytes.push(carry & 0xff);

      carry >>= 8;
    }
  }

  var zeros = decodedLen(string.length) - bytes.length;

  for (i = 0; i < zeros; i++) bytes.push(0);

  return "0x" + toHexString(bytes.reverse());
}



const addr = "0x32Be343B94f860124dC4fEe278FDCBD38C102D88";
const encaddr = "Vi18WoPnMwQgcnqKKEuEEtaA51R9";

console.log({ e: ethToVlx(addr) });
console.log({ d: vlxToEth(ethToVlx(addr)) });
console.log({ d: vlxToEth(encaddr) });
