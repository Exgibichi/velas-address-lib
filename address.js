/* eslint-disable */
function ethToVlxAddress(entrada) {
  var test_max_val = 0;
  var ALPHABET_16 = "0123456789ABCDEF";
  var ALPHABET_58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  var ALP_16_MAP = {};
  var array_64 = [];
  var array_58 = [];
  for (var i = 0; i < ALPHABET_16.length; i += 1) {
    ALP_16_MAP[ALPHABET_16.charAt(i)] = i;
  }
  entrada = entrada.toUpperCase().replace(/0x/i, '');
  for (var t = entrada.length - 1; t >= 0; t = t - 3) {
    if (t > 1) {
      var hex1 = ALP_16_MAP[entrada.charAt(t - 2)];
    } else {
      var hex1 = 0;
    }
    if (t > 0) {
      var hex2 = ALP_16_MAP[entrada.charAt(t - 1)];
    } else {
      var hex2 = 0;
    }
    var tiple_hex = hex1 * 256 + hex2 * 16 + ALP_16_MAP[entrada.charAt(t)];
    var low_val = tiple_hex % 64;
    var hig_val = tiple_hex >> 6;
    array_64.unshift(low_val);
    if (hig_val > 0 || t > 2) {
      array_64.unshift(hig_val);
    }
  }
  array_64.reverse();
  var output_base = 58;
  for (var base = 63; base >= output_base; base -= 1) {
    array_58 = [];
    for (var t = 0; t < array_64.length; t += 1) {
      array_58.push(0);
    }
    var buffer_mult = array_58.slice();
    buffer_mult[0] = 1;
    for (var cdig = 0; cdig < buffer_mult.length; cdig += 1) {
      for (var t = cdig; t > 0; t -= 1) {
        buffer_mult[t] += buffer_mult[t - 1] || 0;
      }
      for (var t = 0; t < cdig; t += 1) {
        if (buffer_mult[t] >= base) {
          var carry_v = 0;
          var q = t;
          do {
            buffer_mult[q] += carry_v;
            if (q < cdig - 1) {
              carry_v = Math.floor(buffer_mult[q] / base);
              buffer_mult[q] %= base;
            } else {
              carry_v = 0;
            }
            q += 1;
          } while (carry_v > 0);
        }
      }
      for (var t = 0; t < buffer_mult.length; t += 1) {
        var carry_v = buffer_mult[t] * (array_64[cdig] || 0);
        var q = t;
        while (carry_v > 0) {
          if (q >= array_58.length) {
            array_58.push(0);
          }
          array_58[q] += carry_v;
          carry_v = Math.floor(array_58[q] / base);
          array_58[q] %= base;
          q += 1;
        }
      }
    }
    array_64 = array_58.slice();
  }
  array_58.reverse();
  var string_result = "";
  for (var t = 0; t < array_58.length; t += 1) {
    string_result += ALPHABET_58.charAt(array_58[t]);
  }
  return "V" + string_result;
}

const addr = "0x32Be343B94f860124dC4fEe278FDCBD38C102D88";

console.log(ethToVlxAddress(addr));


