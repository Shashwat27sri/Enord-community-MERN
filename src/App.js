import React, { useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import {
  BrowserRouter as Router, Switch, Route,Redirect,
} from 'react-router-dom'
import { Link } from "react-router-dom";

import Enord from './components/Enord';
import ViewQuestion from './components/ViewQuestion';
import Question from './components/Add-Question/Question';
import Auth from "./components/Auth"; 
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from './feature/userSlice';
import { auth } from './firebase';

function App() {
  const user = useSelector(selectUser)
  const dispatch= useDispatch()

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser){
        dispatch(login({
          uid: authUser.uid,
          photo: authUser.photoURL,
          displayName: authUser.displayName,
          email: authUser.email
        }))
      }else{
        dispatch(logout())
      }
    })
  }, [dispatch])

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => user ? (<Component {...props}/>) : (
      <Redirect to ={{
        pathname: '/auth',
        state: {
          from: props.location,
        },
      }}
      />
      )
    }
    />
  );
  
return (
    <div className="App">   
      {/* <p>Hello</p> */}
      <Router>
        <Header />
        <Switch>
          <Route exact path = {user ? '/' : "/auth"} component = {user ? Enord : Auth} />
          <PrivateRoute exact path="/add-question" component={Question  } />
          <PrivateRoute exact path="/question" component={ViewQuestion } />
          {/* <PrivateRoute exact path="/" component={Enord} /> */}

          
        </Switch>
      </Router>
    </div>
  );
}

export default App;