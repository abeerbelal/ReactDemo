import React,{useState, useCallback, useEffect} from "react";

let logoutTimer;//global variable in this file 
const AuthContext = React.createContext({
//we define the general shape of our context and get better auto-completion later
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}

});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime');

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
}
//export it as named 
 export const AuthContextProvider =(props) => {
  const tokenData = retrieveStoredToken();
  
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  //set init token val by looking at local storage without use useEffect because local storage is a sync api"the init val will be used once by react '
// const initialToken = localStorage.getItem('token');
     //i wanna manage the state for that auth data 
    const [token, setToken] = useState(initialToken);//we can know whenever the user is logged or not be looking to this state
   //if we have token the user is logged in 
  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');

    if (logoutTimer) {
      clearTimeout(logoutTimer);//to clear that timer if a timer was set 
    }
  }, []);

  const loginHandler = (token, expirationTime) =>{
    setToken(token);
    localStorage.setItem('token', token );
    localStorage.setItem('expirationTime', expirationTime);

    const remainingTime = calculateRemainingTime(expirationTime);
   logoutTimer = setTimeout(logoutHandler, remainingTime);//this logged user out after time finished
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler
  };

//receive props because it will return
return <AuthContext.Provider value={contextValue}>
    {props.children}
</AuthContext.Provider>
//so that we can use this component overall as a wrapper around other components 
//that then will have accsess to this context
};

export default AuthContext;