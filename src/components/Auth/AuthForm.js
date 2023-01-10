import { useState, useRef, useContext } from 'react';
import {useHistory} from 'react-router-dom'
import AuthContext from '../../store/auth-context';
import classes from './AuthForm.module.css';

const AuthForm = () => {
  const history = useHistory();
  const emailInputRef = useRef();//using ref insted of check every keypress
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);



  const [isLogin, setIsLogin] = useState(true);
  const [isLoding, setIsLoding] = useState(false);// to set while the respose reached 
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event)=>{
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    //optional:add validation 
    setIsLoding(true);
    //check if we in login mood 
    let url;
    if (isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD5e8Oj-nYZyWwmq9SnK929moBazE0d804';

    } else{
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD5e8Oj-nYZyWwmq9SnK929moBazE0d804';
    }
      //this will send such a sin up request
      fetch(
        url,
     {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
        //we send it and alawys should br true "firebase doc"
      }),
      headers: {
        'Content-Type': 'application/json'
      }
     }
     ).then(res =>{//to handle the response because fetch return promisse
        setIsLoding(false);//no mater what is response it will set to false 
      if(res.ok) {
          return res.json();
        }else {
          //if it fails ,it turns out that this response data, which 
          //we get back will hold some extra info so looking to response datat by looking to ...
        return  res.json().then(data =>{
            //show an error modal 
           // console.log(data);
           let erroeMessage = 'Authountication Faild ';
           if (data && data.error && data.error.message) {
            erroeMessage = data.error.message;
           }
           //alert(erroeMessage);
           throw new Error(erroeMessage);
           
          });
        }
     }).then(data => {//here where i get my response ,sucsses case or where i catch errors we might have 
        //here where we have a sucssful resp

        const expirationTime = new Date(
          new Date().getTime() + (+data.expiresIn * 1000)
        );
       authCtx.login(data.idToken, expirationTime.toISOString());//it will be that token from firebase
          history.replace('/');
    
      }).catch((err) => {
      alert(err.message);
     })
  };


  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required  ref={emailInputRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required  ref={passwordInputRef}/>
        </div>
        <div className={classes.actions}>
          {!isLoding && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoding && <p>sending request ....</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
