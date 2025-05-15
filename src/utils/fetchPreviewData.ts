import { unescape } from "querystring";
import { useEffect, useState } from "react";

type MorpherPricePreview = {
  timestampInMilis: number;
  priceDecimal: number;
  value: number;
}




export function usePreviewAPIPolling(feedId: string, delay: number): MorpherPricePreview | undefined {
  const [data, setData] = useState<MorpherPricePreview | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://oracle-bundler.morpher.com/rpc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'jsonrpc': '2.0',
            'method': 'eth_oracleDataPreview',
            'params': [
              feedId
            ],
            'id': 1
          })
        })
        const json = await response.json();
        // console.log(json.result)
        // console.log(decodeHexString(json.result));

        setData(decodeHexString(json.result))
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, delay);

    // Clear the interval on unmount
    return () => clearInterval(intervalId);
  }, [feedId, delay]);

  return data;
}


// export function usePreviewData(feedId: string) {
//     const [data, setData] = useState<MorpherPricePreview | undefined>();

//     let id = 1;

//     console.log("called usePreviewData", feedId, isRunning[feedId]);


//     useEffect(() => {


//         // if (data == undefined) {

//         //     fetch('https://oracle-bundler.morpher.com/rpc', {
//         //         method: 'POST',
//         //         headers: {
//         //             'Content-Type': 'application/json'
//         //         },
//         //         body: JSON.stringify({
//         //             'jsonrpc': '2.0',
//         //             'method': 'eth_oracleDataPreview',
//         //             'params': [
//         //                 feedId
//         //             ],
//         //             'id': id++
//         //         })
//         //     }).then(async (response) => {
//         //         if (!response.ok) {
//         //             console.error(`Response status: ${response.status}`);
//         //             setData(undefined);
//         //         }

//         //         const json = await response.json();
//         //         console.log(json.result)
//         //         console.log(decodeHexString(json.result));

//         //         setData(decodeHexString(json.result))


//         //     }).catch(e => {
//         //         console.error(feedId)
//         //         console.error(e);
//         //     })
//         // }

//         let intervalId: NodeJS.Timeout = setInterval(() => fetch('https://oracle-bundler.morpher.com/rpc', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 'jsonrpc': '2.0',
//                 'method': 'eth_oracleDataPreview',
//                 'params': [
//                     feedId
//                 ],
//                 'id': id++
//             })
//         }).then(async (response) => {
//             if (!response.ok) {
//                 console.error(`Response status: ${response.status}`);
//                 setData(undefined);
//             }

//             const json = await response.json();
//             console.log(json.result)
//             console.log(decodeHexString(json.result));

//             setData(decodeHexString(json.result))
//         }), 5000);

//         return () => { intervalId ?? clearInterval(intervalId); };
//     });


//     return data;
// }

// export function usePreviewXau() {
//     return usePreviewData("0xa1f6631578bf799b864f045298214109bf1efe5d0a944674efa81bd9c90c10d6");
// }


// export function usePreviewXag() {
//     return usePreviewData("0xa77010d8a18857daea7ece96bedb40730ab5be50d8094d2bd8008926ca492844");


// }
// export function usePreviewPOL() {

//     return usePreviewData("0x9a668d8b2069cae627ac3dff9136de03849d0742ff88edb112e7be6b4663b37d");


// }


function decodeHexString(hexString: `0x{string}`): MorpherPricePreview {
  // Ensure the input is a 64-character hex string (32 bytes)
  if (hexString.length !== 64 && hexString.length !== 66) {
    throw new Error("Input should be a 32-byte (64-character) hex string. Given " + hexString);
  }

  const startChar = hexString.length === 64 ? 0 : 2;

  // Step 1: Extract the first 6 bytes for the timestamp (first 12 hex characters)
  const timestampHex = hexString.slice(0 + startChar, 12 + startChar); // First 6 bytes
  const timestamp = parseInt(`0x${timestampHex}`, 16); // Convert to a number in milliseconds

  // Step 2: Extract the 7th byte for the price decimal (next 2 hex characters)
  const priceDecimalHex = hexString.slice(12 + startChar, 14 + startChar); // 7th byte
  const priceDecimal = parseInt(priceDecimalHex, 16); // Should always be 18 (0x12)

  // Step 3: Extract the price value from the last 25 bytes (50 hex characters)
  const priceValueHex = hexString.slice(14 + startChar); // Remaining 50 hex characters

  // Step 4: Split into integer part (first 14 hex chars) and decimal part (last 36 hex chars)
  const priceIntegerHex = priceValueHex.slice(0, 14); // First 7 bytes (14 hex chars)
  const priceDecimalHexPart = priceValueHex.slice(14); // Last 18 bytes (36 hex chars)

  // Convert integer part from hex to number
  const priceInteger = BigInt(`0x${priceIntegerHex}`);

  // Convert decimal part from hex to a number
  const priceDecimalPart = BigInt(`0x${priceDecimalHexPart}`);

  // Step 5: Combine the price: integer part + (decimal part / 10^18)
  const fullPrice = Number(priceInteger) + Number(priceDecimalPart) / 10 ** 18;

  // Return the decoded values
  return {
    timestampInMilis: timestamp,
    priceDecimal,
    value: fullPrice
  };
}

