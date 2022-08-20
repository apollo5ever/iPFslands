import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import App from './App';
import About from './components/about'
import FundList from './components/fundList'

import Fundraiser from './components/fundraiser';
import CreateFund from './components/addFundraiser'
import BuryTreasure from './components/buryTreasure';

import {LoginProvider} from './LoginContext'

import OAO from './components/oao'
import CEO from './components/ceo'
import BountyList from './components/bountyList';



ReactDOM.render(
  
  <LoginProvider>
  <HashRouter>
  <Routes className="main">
    <Route path="/" element={<App/>}>
      <Route path="/about" element={<About/>}/>
     
      <Route path="/island/:island/smokesignal/:index" element={<Fundraiser/>}/>
     
      <Route path="about" element={<About />}/>
      <Route path="smokesignals" element={<FundList />} />
      <Route path="treasure" element={<BountyList/>}/>
      <Route path="/newsignal" element={<CreateFund/>}/>
      <Route path="/burytreasure" element={<BuryTreasure/>}/>
      <Route path="/oao" element={<OAO/>}/>
      <Route path="/ceo" element={<CEO/>}/>
     
    </Route>
  </Routes>
  
</HashRouter>
</LoginProvider>

  , document.getElementById('root'));

