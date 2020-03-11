<?php
function ethToVlxAddress(string $string): string
{
    $SIGNATURE = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    $BASE58_LENGTH = '58';
    $BASE256_LENGTH = '256';

    $string = (string) $string;
    $string = hex2bin(str_replace('0x', '',  $string));

    if (empty($string)) {
        return '';
    }

    $bytes = array_values(array_map(function ($byte) {
        return (string) $byte;
    }, unpack('C*', $string)));
    $base10 = $bytes[0];

    // Convert string into base 10
    for ($i = 1, $l = count($bytes); $i < $l; $i++) {
        $base10 = bcmul($base10, $BASE256_LENGTH);
        $base10 = bcadd($base10, $bytes[$i]);
    }

    // Convert base 10 to base 58 string
    $base58 = '';
    while ($base10 >= $BASE58_LENGTH) {
        $div = bcdiv($base10, $BASE58_LENGTH, 0);
        $mod = bcmod($base10, $BASE58_LENGTH);
        $base58 .= $SIGNATURE[$mod];
        $base10 = $div;
    }
    if ($base10 > 0) {
        $base58 .= $SIGNATURE[$base10];
    }

    // Base 10 to Base 58 requires conversion
    $base58 = strrev($base58);

    // Add leading zeros
    foreach ($bytes as $byte) {
        if ($byte === '0') {
            $base58 = $SIGNATURE[0] . $base58;
            continue;
        }
        break;
    }

    return 'V' . $base58;
}

function vlxToEthAddress(string $base58): string
{
    if (empty($base58)) {
        return '';
    }

    $SIGNATURE = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    $BASE58_LENGTH = '58';
    $BASE256_LENGTH = '256';

    $indexes = array_flip(str_split($SIGNATURE));
    $chars = str_split($base58);
    array_shift($chars);
    // Check for invalid characters in the supplied base58 string
    foreach ($chars as $char) {
        if (isset($indexes[$char]) === false) {
            throw new InvalidArgumentException('Argument $base58 contains invalid characters. ($char: "' . $char . '" | $base58: "' . $base58 . '") ');
        }
    }

    // Convert from base58 to base10
    $decimal = (string) $indexes[$chars[0]];

    for ($i = 1, $l = count($chars); $i < $l; $i++) {
        $decimal = bcmul($decimal, $BASE58_LENGTH);
        $decimal = bcadd($decimal, (string) $indexes[$chars[$i]]);
    }

    // Convert from base10 to base256 (8-bit byte array)
    $output = '';
    while ($decimal > 0) {
        $byte = bcmod($decimal, $BASE256_LENGTH);
        $output = pack('C', $byte) . $output;
        $decimal = bcdiv($decimal, $BASE256_LENGTH, 0);
    }

    // Now we need to add leading zeros
    foreach ($chars as $char) {
        if ($indexes[$char] === 0) {
            $output = "\x00" . $output;
            continue;
        }
        break;
    }

    return '0x' . bin2hex($output);
}

$eth = "0x32Be343B94f860124dC4fEe278FDCBD38C102D88";
$vlx = ethToVlxAddress($eth);
echo "ETH: " . $eth . "\r\n";
echo "VLX: " . $vlx . "\r\n";
$restoredEth = vlxToEthAddress($vlx);
echo "Restored Eth: " . $restoredEth . "\r\n";
