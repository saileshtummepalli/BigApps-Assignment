import React from 'react';
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import Login from "../src/Components/Login";
import Table from "../src/Components/Table";
import Drag from "../src/Components/Drag";
function App() {
  const hist = createBrowserHistory();

  return (
    <Router history={hist}>
      
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/table" component={Table} />
      <Route exact path="/drag" component={Drag} />
    </Switch>
     
    </Router>
  );
}

export default App;
