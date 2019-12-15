import React, { useState, useEffect, useCallback, } from 'react';
import User from '../interfaces/user';
import { useQuery } from '@apollo/react-hooks';
import { ME_QUERY } from '../queries/me';
import isServer from '../helpers/isServer';

const AuthContext = React.createContext<{
  user: User,
  onChangeUser: (User) => void,
  onLogout: () => void,
}>({
  user: null,
  onChangeUser: null,
  onLogout: null,
})

export function AuthContextProvider(props) {
  const { children } = props;
  const [user, setUser] = useState<User>(null);
  const { data } = useQuery(ME_QUERY, { variables: { token: !isServer() && localStorage.getItem('token') } });
  const handleLogout = useCallback(() => {
    setUser(null);
    !isServer() && localStorage.removeItem('token');
  }, []);
  useEffect(() => {
    if (data && data.me) {
      setUser(data.me as User);
    }
  }, [data])

  return (
    <AuthContext.Provider
      value={{
        user,
        onChangeUser: setUser,
        onLogout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;
