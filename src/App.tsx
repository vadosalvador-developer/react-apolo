import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import SignIn from './components/SignIn';
import PartnerCabinet from './components/PartnerCabinet';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={SignIn} path="/" exact />
        <Route component={PartnerCabinet} path="/partner_cabinet" />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
