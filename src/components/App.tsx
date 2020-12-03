import React, { useContext, useState } from 'react'
import { walletConnectContext } from '../contexts/WalletConnectContext'

export const App: React.FC = () => {
  const {
    connect,
    disconnect,
    sendTransaction,
    account,
    connected,
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
      <button onClick={send} type="button" disabled={!connected}>
        Send
      </button>
    </div>
  )
}
export default App
