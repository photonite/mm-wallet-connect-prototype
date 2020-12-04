import React, { createContext, useEffect, useState } from 'react'
import WalletConnectProvider from '@walletconnect/web3-provider'

const getWCProvider = () =>
  new WalletConnectProvider({
    infuraId: process.env.REACT_APP_INFURA_ID,
  })

interface IConfig {
  account: string
  chainId: number
  connected: boolean
}

interface IWalletConnectContext {
  account: string
  chainId: number
  connected: boolean
  connect: () => void
  disconnect: () => void
  sendTransaction: (tx: any) => void
  provider: any
}

const INITIAL_CONFIG: IConfig = {
  account: '',
  chainId: -1,
  connected: false,
}

export const walletConnectContext = createContext({} as IWalletConnectContext)

const WalletConnectContextProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }: { children: React.ReactNode }) => {
  const [provider, setProvider] = useState(getWCProvider)

  const [config, setConfig] = useState<IConfig>({
    ...INITIAL_CONFIG,
    connected: provider.connected,
  })

  useEffect(() => {
    provider.on('accountsChanged', (accounts: string[]) => {
      setConfig({
        account: accounts[0],
        connected: provider.connected,
        chainId: provider.chainId,
      })
    })
    provider.on('chainChanged', (chainId: number) => {
      setConfig({
        account: provider.accounts[0],
        connected: provider.connected,
        chainId,
      })
    })

    provider.on('connect', () => {
      const { accounts, chainId, connected } = provider

      if (accounts[0] !== process.env.REACT_APP_ADMIN_ADDRESS) {
        // eslint-disable-next-line no-alert
        alert('Please only connect to admin address')
        provider.disconnect()
      } else {
        setConfig({
          account: accounts[0],
          chainId,
          connected,
        })
      }
    })

    provider.on('disconnect', () => {
      const newProvider = getWCProvider()

      setProvider(newProvider)
      setConfig({
        account: newProvider.accounts[0],
        connected: newProvider.connected,
        chainId: newProvider.chainId,
      })
    })
  }, [provider])

  const sendTransaction = async (tx: any) => {
    const { connected } = config

    if (connected && provider) {
      return provider.wc.sendTransaction(tx)
    }

    return null
  }

  const connect = async () => {
    try {
      await provider.enable()
    } catch (error) {
      console.warn(error)
      const newProvider = getWCProvider()

      setProvider(newProvider)
    }
  }

  return (
    <walletConnectContext.Provider
      value={{
        ...config,
        connect,
        disconnect: () => provider.disconnect(),
        sendTransaction,
        provider,
      }}
    >
      {children}
    </walletConnectContext.Provider>
  )
}

export default WalletConnectContextProvider
