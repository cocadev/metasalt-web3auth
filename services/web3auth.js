import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import { ADAPTER_EVENTS } from '@web3auth/base';
import { Web3Auth } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { CHAIN_CONFIG } from './chainConfig';
import { getWalletProvider } from './walletProvider';
import { getAllUsers, getUserByAccount } from '../common/api';
import { DEMO_AVATAR } from '../keys';


export const Web3AuthContext = createContext({
  web3Auth: null,
  provider: null,
  isLoading: false,
  openlogin: null,
  user: null,
  chain: '',
  isAuthenticated: false,
  rightBarUsers: [],

  setChain: () => {},
  setUser: () => {},
  login: async () => {},
  logout: async () => {},
  getUserInfo: async () => {},
  signMessage: async () => {},
  getAccounts: async () => {},
  getBalance: async () => {},
  signTransaction: async () => {},
  signAndSendTransaction: async () => {},
});

export function useWeb3Auth() {
  return useContext(Web3AuthContext);
}

export const Web3AuthProvider = ({ children, web3AuthNetwork }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [web3Auth, setWeb3Auth] = useState(null);
  const [openlogin, setOpenlogin] = useState(null);
  const [provider, setProvider] = useState(null);
  const [user, setUser] = useState(null);
  const [chain, setChain] = useState('goerli');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rightBarUsers, setRightBarUsers] = useState([])

  const setWalletProvider = useCallback((web3authProvider) => {
    const walletProvider = getWalletProvider(chain, web3authProvider, uiConsole);
    setProvider(walletProvider);
    setIsAuthenticated(true);
    console.log('chain ============> ', chain)
  }, [chain]);

  useEffect(() => {
    const subscribeAuthEvents = (web3auth) => {
      // Can subscribe to all ADAPTER_EVENTS and LOGIN_MODAL_EVENTS
      web3auth.on(ADAPTER_EVENTS.CONNECTED, (data) => {
        console.log('Yeah!, you are successfully logged in =====>', data);
        setOpenlogin(data);
        setWalletProvider(web3auth.provider);
      });

      web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
        console.log('connecting =====>');
      });

      web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        console.log('disconnected =====>');
        setOpenlogin(null);
      });

      web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
        console.error('some error or user has cancelled login request =====>', error);
      });
    };

    const currentChainConfig = CHAIN_CONFIG[chain];
    console.log('============== currentChainConfig ==============', currentChainConfig)

    async function init() {

      console.log('============== init ==============')

      try {
        setIsLoading(true);
        const clientId = 'BKDLgC16iXcFMtdEESnaZ2j53r-e7LEcnnrQrcLPdL6TwmSnIBr1heG3RevZjqOd3lrQfDdGrtN32cHoCFfcVZY';
        const web3AuthInstance = new Web3Auth({
          chainConfig: currentChainConfig,  // get your client id from https://dashboard.web3auth.io
          clientId,
          uiConfig: {
            defaultLanguage: 'en',
            theme: 'dark',
          },
          enableLogging: true,
        });
        const adapter = new OpenloginAdapter({ adapterSettings: { network: web3AuthNetwork, clientId } });
        web3AuthInstance.configureAdapter(adapter);
        subscribeAuthEvents(web3AuthInstance);
        setWeb3Auth(web3AuthInstance);
        await web3AuthInstance.initModal();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    init()
  }, [chain, web3AuthNetwork, setWalletProvider]);

  useEffect(() => {
    const getUserFromBackend = async () => {
      const localProvider = await web3Auth.connect()
      const web3Js = new Web3(localProvider)
      const accounts = await web3Js.eth.getAccounts()
      const response = await getUserByAccount({ account: accounts[0] })
      setUser(response)
    }

    if (isAuthenticated && web3Auth) {
      getUserFromBackend().then()
    }
  }, [isAuthenticated, web3Auth,])

  useEffect(() => {
    login()
  }, [chain])

  useEffect(() => {
    const loadUsers = async () => {
      const response = await getAllUsers()
      if (response) {
        const sortedUsers = response.filter(item => item?.account !== user?.account).map(item => {
          return {
            id: item.id,
            username: item?.username || 'Unnamed',
            updatedAt: item.updatedAt,
            avatar: item?.avatar || DEMO_AVATAR,
            userAccount: item.account,
            lastOnline: null,
            following: null,
            followed: null
          }
        })
        setRightBarUsers(sortedUsers)
      }
    }

    loadUsers().then()
  }, [user?.account])

  const notExistWeb3Auth = () => {
    console.log('web3auth not initialized yet =====>')
    uiConsole('web3auth not initialized yet')
  }

  const notExistProvider = () => {
    console.log('provider not initialized yet =====>')
    uiConsole('provider not initialized yet')
  }

  const login = async () => {
    if (!web3Auth) {
      notExistWeb3Auth()
      return;
    }

    const localProvider = await web3Auth.connect()
    setWalletProvider(localProvider)

    const userInfo = await web3Auth.getUserInfo()
    const authenticateUser = await web3Auth.authenticateUser()
    const web3Js = new Web3(localProvider)
    const accounts = await web3Js.eth.getAccounts()
    if (userInfo.idToken) {
      return { ...userInfo, account: accounts[0], accounts }
    } else {
      return { ...authenticateUser, account: accounts[0], accounts }
    }
  };

  const logout = async () => {
    if (!web3Auth) {
      notExistWeb3Auth()
      return;
    }

    await web3Auth.logout()
    setProvider(null)
    setUser(null)
    setIsAuthenticated(false)
  };

  const getUserInfo = async () => {
    if (!web3Auth) {
      notExistWeb3Auth()
      return;
    }

    const userInfo = await web3Auth.getUserInfo()
    uiConsole(userInfo)
  };

  const getAccounts = async () => {
    if (!provider) {
      notExistProvider()
      return;
    }
    await provider.getAccounts();
  };

  const getBalance = async () => {
    if (!provider) {
      notExistProvider()
      return;
    }
    await provider.getBalance();
  };

  const signMessage = async () => {
    if (!provider) {
      notExistProvider()
      return;
    }
    await provider.signMessage();
  };

  const signTransaction = async () => {
    if (!provider) {
      notExistProvider()
      return;
    }
    await provider.signTransaction();
  };

  const signAndSendTransaction = async () => {
    if (!provider) {
      notExistProvider()
      return;
    }
    await provider.signAndSendTransaction();
  };

  const uiConsole = (...args) => {
    const el = document.querySelector('#console>p');
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  };

  const contextProvider = {
    web3Auth,
    chain,
    provider,
    openlogin,
    user,
    isLoading,
    isAuthenticated,
    rightBarUsers,

    setChain,
    setUser,
    login,
    logout,
    getUserInfo,
    getAccounts,
    getBalance,
    signMessage,
    signTransaction,
    signAndSendTransaction,
  };

  return <Web3AuthContext.Provider value={contextProvider}>{children}</Web3AuthContext.Provider>;
};
