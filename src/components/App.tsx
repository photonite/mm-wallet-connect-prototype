import { Web3Provider } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import React, { useContext, useState } from 'react'
import { DAI_ADDRESS } from '../constants'
import { walletConnectContext } from '../contexts/WalletConnectContext'
import ERC20TokenService from '../services/ERC20TokenService'

export const App: React.FC = () => {
  const {
    connect,
    disconnect,
    sendTransaction,
    account,
    connected,
    provider,
  } = useContext(walletConnectContext)
  const [receiverAddress, setReceiverAddress] = useState<string>('')

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setReceiverAddress(e.target.value)

  const send = async () => {
    if (connected && receiverAddress) {
      // @todo fix promise never resolving
      const txHash = await sendTransaction({
        from: account,
        to: receiverAddress,
        value: '1',
      })

      console.log({ txHash })
    }
  }

  const getBalance = async () => {
    if (connected && receiverAddress) {
      const erc20Service = await ERC20TokenService.getInstance(
        new Web3Provider(provider),
        DAI_ADDRESS,
      )

      const data = erc20Service.contract.interface.encodeFunctionData(
        'transfer',
        [receiverAddress, BigNumber.from('1')],
      )

      // @todo fix promise never resolving
      const res = await sendTransaction({
        from: account,
        to: DAI_ADDRESS,
        data,
      })

      console.log({ res })
    }
  }

  return (
    <div className="container">
      <input
        value={receiverAddress}
        onChange={onInputChange}
        placeholder="Enter address to transfer to"
      />
      <button
        onClick={() => (connected ? disconnect() : connect())}
        type="button"
      >
        {connected ? 'Disconnect' : 'Connect'}
      </button>
      <button onClick={getBalance} type="button">
        Transfer DAI
      </button>
      <button onClick={send} type="button" disabled={!connected}>
        Transfer ETH
      </button>
    </div>
  )
}
export default App
