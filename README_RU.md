# Библиотеки для де\кодирования адресов в формат веласа/эфира

Функции принимают адреса в формате строки с\без префиксами "0x", "V" 

## Кодирование
Для отображения пользователю адрес его кошелька, мы берем адрес в формате эфира и кодируем функцией `ethToVlx/EthToVlx/eth_to_vlx`

### Пример
```javascript
const addr = "0x32Be343B94f860124dC4fEe278FDCBD38C102D88";

console.log("Encoded address:", ethToVlx(addr)); // V5dJeCa7bmkqmZF53TqjRbnB4fG6hxuu4f
```
## Декодирование
Для отправки транзакций пользователя мы берем адрес в формате веласа и декодируем функцией `vlxToEth/VlxToEth/vlx_to_eth`

### Пример
```javascript
const addr = "V5dJeCa7bmkqmZF53TqjRbnB4fG6hxuu4f";

console.log("Decoded address:", vlxToEth(addr)); // 0x32be343b94f860124dc4fee278fdcbd38c102d88
```
