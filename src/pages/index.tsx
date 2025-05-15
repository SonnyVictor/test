"use client";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Icons } from "../const/icons";
import { createCallData, EIP712_SAFE_OPERATION_V6_TYPE, getFunctionSelector, SafeAccountV0_2_0 as SafeAccount } from '@morpher-io/dd-abstractionkit';
import { useAccount, useBalance, useChainId, usePublicClient, useReadContract, useSendTransaction, useSignMessage, useSignTypedData, useWalletClient, useWriteContract } from 'wagmi';

import NFTFANABI from "../abi/nftfanABI.json"

import { useEffect, useState } from 'react';
import { formatEther, formatUnits, keccak256, parseEther } from 'viem';
import { usePreviewAPIPolling } from '../utils/fetchPreviewData';


const Home: NextPage = () => {
  const { address, isConnected } = useAccount();

  const [smartAccount, setSmartAccount] = useState<SafeAccount | undefined>();

  const [lastUserOpHash, setLastUserOpHash] = useState<string | undefined>();

  const publicClient = usePublicClient();
  const walletClient = useWalletClient()
  const chainId = useChainId();

  const gasBalance = useBalance({ address: smartAccount?.accountAddress as `0x${string}` })



  const { sendTransaction } = useSendTransaction();

  const pricePreview = usePreviewAPIPolling("0xa77010d8a18857daea7ece96bedb40730ab5be50d8094d2bd8008926ca492844", 5000);
  const pricePreviewPol = usePreviewAPIPolling("0x9a668d8b2069cae627ac3dff9136de03849d0742ff88edb112e7be6b4663b37d", 5000);


  useEffect(() => {
    if (address) {
      setSmartAccount(SafeAccount.initializeNewAccount([address]));
    } else {
      setSmartAccount(undefined);
    }
  }, [address]);



  const priceMintNFT = useReadContract({
    abi: NFTFANABI,
    address: "0x68d07515F61cbFD8179d31Dc9E21e4A70134b513",
    functionName: 'priceMint',
  })

  console.log("priceMintNFT", priceMintNFT.data)

  const { writeContractAsync, isPending } = useWriteContract()

  const [txHashMint, setTxHashMint] = useState<any>();
  const mintNftTest = async () => {
    try {
      const txHash = await writeContractAsync({
        abi: NFTFANABI,
        address: "0x68d07515F61cbFD8179d31Dc9E21e4A70134b513",
        functionName: 'mintBuyNFT',
        args: [1, 1], // id = 1, amount = 1
        value: priceMintNFT.data as bigint
      })
      const scanUrl = `https://polygonscan.com/tx/${txHash}`
      console.log('%c✅ Mint Transaction Sent:', 'color: green; font-weight: bold;')
      console.log(scanUrl)
      console.log('Mint sent:', txHash)
      setTxHashMint(scanUrl)
      alert(`✅ Mint Success!\n\nInfo Transaction:\n${scanUrl}`)
    } catch (err: any) {
      console.error('❌ Error minting:', err)
      alert(`❌ Mint failed: ${err.message}`)
    }
  }



  async function mintNft() {

    if (smartAccount == undefined || address == undefined) return;
    const mintFunctionSelector = getFunctionSelector("safeMint(address)");
    const mintTransactionCallData = createCallData(
      mintFunctionSelector,
      ["address"],
      [smartAccount?.accountAddress as `0x${string}`]
    );

    const value = pricePreview !== undefined && pricePreviewPol !== undefined ? (pricePreview.value / pricePreviewPol.value) : 0;

    const mintTransaction = {
      to: process.env.NEXT_PUBLIC_TOKEN_ADDRESS!,
      value: BigInt(value * 1.1 * 1e18), //everything will be sent back anyways
      data: mintTransactionCallData,
    }

    const mintUserOp = await smartAccount.createUserOperation(
      [mintTransaction],
      publicClient?.transport.url,
      process.env.NEXT_PUBLIC_BUNDLER_RPC!,
    )

    const domain = {
      chainId,
      verifyingContract: smartAccount.safe4337ModuleAddress as `0x{string}`,
    };

    const types = EIP712_SAFE_OPERATION_V6_TYPE;

    // formate according to EIP712 Safe Operation Type
    const { sender, ...userOp } = mintUserOp;
    const safeUserOperation = {
      ...userOp,
      safe: mintUserOp.sender,
      validUntil: BigInt(0),
      validAfter: BigInt(0),
      entryPoint: smartAccount.entrypointAddress,
    };


    const signature = await walletClient.data?.signTypedData({
      domain,
      types,
      primaryType: 'SafeOp',
      message: safeUserOperation,
    });
    mintUserOp.signature = SafeAccount.formatEip712SignaturesToUseroperationSignature([address], [signature as string]);

    const sendUserOperationResponse = await smartAccount.sendUserOperation(mintUserOp, process.env.NEXT_PUBLIC_BUNDLER_RPC!);
    setLastUserOpHash(sendUserOperationResponse.userOperationHash);

  }

  const { data: signMessageData, error, signMessage, variables } = useSignMessage()
  const message = "Login to Dapp with demo project ABC  ";

  useEffect(() => {
    if (signMessageData) {
      console.log('Sign message data:', signMessageData);
    }
    if (error) {
      console.error('Error signing message:', error);
    }
  }, [signMessageData, error]);
  // useEffect(() => {
  //   if (signMessageData) {
  //     console.log('Sign message data:', signMessageData);
  //   }
  //   if (error) {
  //     console.error('Error signing message:', error);
  //   }
  // }, []);

  const handleVerify = async () => {
    try {
      let data = {
        address: address,
        signature: signMessageData,
        message: message,
      };

      console.log("data", data);
      // await ChatBotApi.verify(data)
      //   .then((res: any) => {
      //     if (res && res.status === 200) {
      //       toast.success("Verify completed");
      //       localStorage.setItem("verify", "verified")
      //     }
      //   })
      //   .catch((errors) => {
      //     // console.log(errors);
      //   });
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    if (address) {
      signMessage({
        // address: address.toLowerCase() as `0x${string}`,
        account: address.toLowerCase() as `0x${string}`,
        // signature: signMessageData?.toLowerCase() as `0x${string}`,
        message: message,
      });
    }
  }, [address]);


  return (
    <div>
      <div className="container mx-auto text-center">
        <Head>
          <title>Morpher Oracle Silver NFT Demo App</title>

          <link rel="icon" type="image/svg+xml"
            href="images/silver.svg" />
        </Head>


        <h1 className="text-center my-6 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          DApp Demo
        </h1>

        <div className='flex flex-row justify-between my-6'>
          <div></div>
          <ConnectButton />
          <div></div>
        </div>

        {isConnected && <>


          <div className='flex justify-center mb-6'>
            <Icons.silverCoin className='w-20 h-20' />
          </div>



          <div className='flex flex-col gap-2 mb-6'>
            {smartAccount && <p>Your Smart Account Address is {smartAccount.accountAddress}
              {gasBalance.isFetched && <><div className='flex flex-row gap-1 justify-center'><p>which has {gasBalance.data?.value !== undefined ? formatUnits(gasBalance.data?.value, gasBalance.data?.decimals) : 0} {gasBalance.data?.symbol}</p>
                <button
                  title='Top Up'
                  className='border p-1 rounded-md hover:bg-gray-100'
                  onClick={() =>
                    sendTransaction({
                      to: smartAccount?.accountAddress as `0x${string}`,
                      value: parseEther((pricePreview !== undefined && pricePreviewPol !== undefined ? (pricePreview.value / pricePreviewPol.value) : 100).toString()),
                    })
                  }
                >
                  <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                  </svg>

                </button></div></>}
            </p>}
            <p>
              {`https://opensea.io/collection/unidentified-contract-25ba0c74-2678-46a4-a6ca-c4b3`}
            </p>
          </div>
          <button onClick={() => mintNftTest()} type="button" className="text-white bg-[#a0a0a0] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2">
            Mint one for NFT Collection
          </button>
          {lastUserOpHash && <a href={"https://jiffyscan.xyz/userOpHash/" + lastUserOpHash} target='_blank'>https://jiffyscan.xyz/userOpHash/{lastUserOpHash}</a>}
          {txHashMint}

        </>}
      </div>
      <footer className="my-6 bg-gray-100 text-center p-10">

      </footer>
    </div>
  );
};

export default Home;
