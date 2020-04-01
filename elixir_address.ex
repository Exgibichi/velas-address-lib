defmodule Vlx_address do
  @alphabet ~c(123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz)

  @doc """
  Encodes the given ethereum address to vlx format.
  """
  def eth_to_vlx(address) do
    stripped_address =
      case address do
        "0x" <> addr when byte_size(addr) == 40 -> String.downcase addr
        _ -> raise ArgumentError, message: "Invalid address"
      end

    checksum =
      stripped_address
      |> sha256
      |> sha256
      |> String.slice(0, 8)

    parsed_address =
      stripped_address <> checksum
      |> Integer.parse(16)

    case parsed_address do
      {is_integer, ""} -> nil
      _ -> raise ArgumentError, message: "Invalid address"
    end

    encoded_address =
      parsed_address
      |> elem(0)
      |> b58_encode()

    "V" <> encoded_address
  end

  @doc """
  Decodes the given vlx address to ethereum format.
  """
  def vlx_to_eth(address) do
    decoded_address =
      address
      |> String.trim_leading("V")
      |> b58_decode()
      |> Integer.to_string(16)
      |> String.downcase
      |> String.pad_leading(40, "0")

    strings = Regex.run(~r/([0-9abcdef]+)([0-9abcdef]{8})$/, decoded_address)

    [_, short_address, extracted_checksum] =
      case strings do
        list when length(list) == 3 -> list
        _ -> raise ArgumentError, message: "Invalid address"
      end

    checksum = 
      short_address
      |> sha256
      |> sha256
      |> String.slice(0, 8)      

    if extracted_checksum != checksum do
      raise ArgumentError, message: "Invalid checksum"
    end

    ("0x" <> short_address) |> String.downcase()
  end

  @doc """
  Encodes the given integer.
  """
  defp b58_encode(x), do: _encode(x, [])

  @doc """
  Decodes the given string.
  """
  defp b58_decode(enc), do: _decode(enc |> to_char_list, 0)

  defp _encode(0, []), do: [@alphabet |> hd] |> to_string
  defp _encode(0, acc), do: acc |> to_string

  defp _encode(x, acc) do
    _encode(div(x, 58), [Enum.at(@alphabet, rem(x, 58)) | acc])
  end

  defp _decode([], acc), do: acc

  defp _decode([c | cs], acc) do
    _decode(cs, acc * 58 + Enum.find_index(@alphabet, &(&1 == c)))
  end

  @doc """
  Sha256 and convert to hex
  """
  defp sha256(x) do
    :crypto.hash(:sha256, x) 
    |> Base.encode16(case: :lower)
  end
end
