import React, { createContext, useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';

const CurrentUserContext = createContext()
const useCurrentUser = () => useContext(CurrentUserContext)

const API_URL = 'https://api.glitch.com'

async function getUserForPersistentToken (persistentToken) {
  if (!persistentToken) throw new Error("No token provided")
  const res = await fetch(`${API_URL}/v1/users/by/persistentToken?persistentToken=${persistentToken}`)
  if (!res.ok) throw new Error(res)
  const data = await res.json()
  return res[persistentToken]
}

function useLocalStorage (key, defaultValue = null) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key)
    if (storedValue) return JSON.parse(storedValue)
    return defaultValue
  })
  const setAndPersistValue = (newValue) => {
    setValue(newValue)
    localStorage.setItem(key, JSON.stringify(newValue))
  }
  return [value, setAndPersistValue]
}

function useAsyncFunction (fn, deps = []) {
  const [state, setState] = useState({ status: 'pending' })
  useEffect(() => {
    let isCurrentRequest = true
    fn(...deps).then(
      value => {
        if (!isCurrentRequest) return
        setState({ status: 'resolved', value })
      },
      error => {
        if (!isCurrentRequest) return
        setState({ status: 'rejected', error })
      }
    )
    return () => {
      isCurrentRequest = false
    }
  }, deps)
  return state
}

const Loading = () => <div>Loading...</div>

const Login = () => {
  const [status, setStatus] = useState('init')
  const [_, setPersistentToken] = useLocalStorage('persistentToken')
  const submitEmail = (emailAddress) => {
    setStatus('submittedEmail')
    fetch(`${API_URL}/email/sendLoginEmail`, { 
      method: 'POST', 
      body: JSON.stringify({ emailAddress }),
      mode: 'cors'
    });
  }
  const submitSigninCode = async (code) => {
    setStatus('submittedSignInCode')
    const res = await fetch(`${API_URL}/auth/email/${code}`, { method: 'POST', mode: 'cors' })
    if (!res.ok) {
      setStatus('error')
      return
    }
    const { persistentToken } = await res.json()
    setPersistentToken(persistentToken)
    window.reload()
  }
}

const CurrentUserController = ({ children}) => {
  const [persistentToken] = useLocalStorage('persistentToken')
  
  const { status, value: currentUser } = useAsyncFunction(getUserForPersistentToken, [persistentToken])
  
  return (
    <CurrentUserContext.Provider value={currentUser}>
      {status === 'pending' && <Loading />}
      {status === 'resolved' && children}
      {status === 'rejected' && <Login />}
    </CurrentUserContext.Provider>
  )
}

const Main = () => {
  return (
    <CurrentUserController>
      <div>Hello, world!</div>     
    </CurrentUserController>
  );
};

ReactDOM.render(<Main />, document.querySelector('#app'));
