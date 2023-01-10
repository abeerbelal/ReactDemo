import { useRef, useContext } from 'react';
import {useHistory} from 'react-router-dom'
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const history = useHistory();
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);//from which we can get our token
  const submitHandler = event =>{
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;
    //we can add validation here

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyD5e8Oj-nYZyWwmq9SnK929moBazE0d804',
    {
       
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.idToken,
        password: enteredNewPassword,
        returnSecureToken: false, //return new id token when it T

  }),
  headers: {
    'Content-Type': 'application/json'
  }
}

    ).then(res =>{
      //assumtion always succeeds
      history.replace('/');
    })
  };
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password'  minLength="7" ref={newPasswordInputRef}/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
