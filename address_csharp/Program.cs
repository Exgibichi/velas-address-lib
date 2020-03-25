using System;
using System.Text;
using static System.Console;
using Base58Check;

namespace EncodeDecodeHexBase58
{
    internal class Program
    {
        private static void Main(string[] args)
        {
            string textTest = "0x32Be343B94f860124dC4fEe278FDCBD38C102D88";
            var bitTest = Base58CheckEncoding.GetBytes(textTest);
            string text = "Vi18WoPnMwQgcnqKKEuEEtaA51R9";

            WriteLine("Encoding = ");
            WriteLine(Base58CheckEncoding.EthToVlx(bitTest));
            WriteLine();
            WriteLine("Decoding = ");
            WriteLine(BitConverter.ToString(Base58CheckEncoding.VlxToEth(Base58CheckEncoding.GetCorrectString(text))));
            ReadKey();
        }
    }
}
