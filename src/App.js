import React from 'react'
import './App.css';
import {Outlet,NavLink,Link} from 'react-router-dom'
import * as IPFS from 'ipfs-core'
import DeroBridgeApi from 'dero-rpc-bridge-api'
import {LoginContext} from './LoginContext'
//import {create} from 'ipfs-http-client'


import to from 'await-to-js'



function App() {
  
 
  const [ipfs,setipfs] = React.useState(null)


  const deroBridgeApiRef = React.useRef()
  const [state, setState] = React.useContext(LoginContext);
  const [bridgeInitText, setBridgeInitText] = React.useState(<a href="https://chrome.google.com/webstore/detail/dero-rpc-bridge/nmofcfcaegdplgbjnadipebgfbodplpd" target="_blank" rel="noopener noreferrer">Not connected to extension. Download here.</a>)
  const [cocoBalance,setCocoBalance] = React.useState(0)

  
  const getSCID = React.useCallback(async () => {
      console.log("GETSCID")

    


    const deroBridgeApi = deroBridgeApiRef.current
    const [err,res] = await to(deroBridgeApi.daemon('get-sc',{
      "scid": "0000000000000000000000000000000000000000000000000000000000000001",
      "keysstring":["keystore"]
    }))
    let keystore_scid= "80"+res.data.result.valuesstring[0].substring(2,64)
    const [err2,res2] = await to(deroBridgeApi.daemon('get-sc',{
      "scid": keystore_scid,
      "keysstring":["k:private.islands.scid"]
    }))
    let scid = res2.data.result.valuesstring[0]
    setState(state=>({...state,scid:scid}))
    //const ipfsboy = await IPFS.create()
    const ipfsboy = await IPFS.create()
   
    const validIp4 = '/ip4/64.225.105.42/tcp/4001/p2p/QmPo1ygpngghu5it8u4Mr3ym6SEU2Wp2wA66Z91Y1S1g29'

    const rez = await ipfsboy.bootstrap.add(validIp4)
    console.log(rez.Peers)
    console.log("id",await ipfsboy.id())
    const config = await ipfsboy.config.getAll()
console.log(config)
    //console.log(ipfsboy)
    setState(state=>({...state,ipfs:ipfsboy}))

   
  })
 
 /* const meta= async()=>{
    console.log("meta")
    const node = await IPFS.create({repo: 'ok'+ Math.random()})
    const {cid} = await node.add(JSON.stringify(testJ).toString())
    console.info(cid.toString())
  /*
    await state.ipfs.start()
    const v = await state.ipfs.version()
    console.log(v)
    const { cid } = await state.ipfs.add(JSON.stringify(testJ).toString())
console.info(cid.toString())

  }
  */

  const stop= async()=>{
    console.log("stop")
   await state.ipfs.stop()
   
    const v = await state.ipfs.version()
    console.log(v)
   
  }

  





  React.useEffect(() => {
    const load = async () => {
      deroBridgeApiRef.current = new DeroBridgeApi()
      const deroBridgeApi = deroBridgeApiRef.current
      const [err] = await to(deroBridgeApi.init())
      if (err) {
        setBridgeInitText(<a href="https://chrome.google.com/webstore/detail/dero-rpc-bridge/nmofcfcaegdplgbjnadipebgfbodplpd" target="_blank" rel="noopener noreferrer">Not connected to extension. Download here.</a>)
      } else {
        setBridgeInitText('rpc-bridge connected')
        setState(state=>({...state,deroBridgeApiRef:deroBridgeApiRef}))
        getSCID();
        getAddress();
        getRandom();
        
      }
    }

    window.addEventListener('load', load)
    return () => window.removeEventListener('load', load)
  }, [])

  const getAddress = React.useCallback(async () => {
    const deroBridgeApi = deroBridgeApiRef.current
    

    const [err0, res0] = await to(deroBridgeApi.wallet('get-address', {
     
   }))

 
   
   console.log("get-address-error",err0)
   console.log(res0)
   if(err0 == null){
    setState(state=>({...state,userAddress:res0.data.result.address}))
    
   }
    })

    const getRandom = React.useCallback(async () => {
      const deroBridgeApi = deroBridgeApiRef.current
      
  
      const [err0, res0] = await to(deroBridgeApi.daemon('get-random-address', {
       
     }))
  
   
     
     console.log("get-random-address-error",err0)
     console.log(res0)
     if(err0 == null){
     setState(state=>({...state,randomAddress:res0.data.result.address[0]}))
      
     }
      })

    const getCocoBalance = React.useCallback(async () => {
      
      const deroBridgeApi = deroBridgeApiRef.current
      const [err,res] = await to(deroBridgeApi.wallet('get-balance',{
        "scid": state.scid
      }))
      console.log("balance:", res.data.result.balance)
      setCocoBalance(res.data.result.balance)
    })

React.useEffect(()=>{
  getCocoBalance();
},[state.scid])


  return (
    
    <div className="App">
      
     
    
     <div className="navbar">
     <NavLink to="smokesignals?status=0">Browse Smoke Signals</NavLink>
    <NavLink to="newsignal">Create Smoke Signal</NavLink>
    <NavLink to="treasure?status=0">Browse Buried Treasure</NavLink>
    <NavLink to="burytreasure">Bury Treasure</NavLink>
     <NavLink to="about">About</NavLink>
     <NavLink to ="oao">OAO</NavLink>
     
     </div>
 
      <div className="rpc-bridge-data">
    {bridgeInitText}
      <h3>Coco Balance: {cocoBalance/100000}</h3>
</div>


     <Outlet />
    </div>
    
  );
}

export default App;
