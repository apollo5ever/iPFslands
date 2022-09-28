import React from 'react'
import TreasureCard from './treasureCard'
import '../App.css'
import {useSearchParams,NavLink} from 'react-router-dom'
import { LoginContext } from '../LoginContext'
import to from 'await-to-js'
import sha256 from 'crypto-js/sha256'


export default function BountyList(){


    const [state, setState] = React.useContext(LoginContext);


   
    const [funds,setFunds] = React.useState([])
    let [searchParams, setSearchParams] = useSearchParams();

    function hex2a(hex) {
      var str = '';
      for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      return str;
  }
  
    const getFunds = React.useCallback(async () => {
     
     const deroBridgeApi = state.deroBridgeApiRef.current
     const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
             scid:state.scid,
             code:false,
             variables:true
     }))
  
     



     var search= new RegExp(`.*_bm`)
     console.log("search",search)
     var scData = res.data.result.stringkeys //.map(x=>x.match(search))

    let fundList= Object.keys(scData)
     .filter(key => search.test(key))
     .map(key=>[hex2a(scData[key]),scData[key.substring(0,key.length-2)+"E"],scData[key.substring(0,key.length-2)+"T"],scData[key.substring(0,key.length-2)+"J"],key.substring(0,key.length-3),scData[key.substring(0,key.length-2)+"JN"],scData[key.substring(0,key.length-2)+"JF"]])
     
     console.log("hash array",fundList)
     
     for(let i = 0; i<fundList.length; i++){
    console.log("helllooo",state.ipfs)
    console.log("funds",funds)
    console.log("fundList",fundList)
    
      for await (const buf of state.ipfs.cat(fundList[i][0].toString())){
        try{
        let fund = JSON.parse(buf.toString())
     
       if(fund.island!=fundList[i][4].substring(0,fundList[i][4].length-1)) continue
       
        fund.index=fundList[i][4].substring(fundList[i][4].length-1)
        fund.expiry = fundList[i][1]
        fund.treasure = fundList[i][2]/100000
        fund.judge = fundList[i][3]
        fund.JN = fundList[i][5]
        fund.JF = fundList[i][6]
        
        if(fund.JF==2) fund.status=1
        else if(fund.expiry<new Date().getTime()/1000) fund.status=2
        else fund.status=0
       
        setFunds(funds=>[...funds,fund])
        console.log("fundz",funds)
      console.log("status",fund.expiry)
    } catch(error){
      console.log(error)
    }
     }
     //const meta = state.ipfs.get(subList[0].toString())
    // console.log("meta",meta)
/*
     const cid = subList[0].toString()
     console.log(cid)

for await (const buf of state.ipfs.cat(cid)) {
 
  console.log(JSON.parse(buf.toString()))
 console.log("fundarray",funds)
  
}
*/
     console.log(err)
     console.log(res)
    
  
     
}}) 

   React.useEffect(()=>{
    getFunds();
  },[state.ipfs])


     
     const fundJSX = funds.map(f => {
        if(searchParams.get("status") && f.status!=searchParams.get("status")) return
        if(searchParams.get("island") && f.island!=searchParams.get("island")) return
        
         return(<div className="function"><TreasureCard JN={f.JN} image={f.image} index={f.index} treasure={f.treasure} deadline={f.deadline} profile={f.island} name={f.name} tagline={f.tagline} /></div>)
        
        })



    
     



      return(
         <div> 
            <div>
                
            <h1>Buried Treasure Bounties</h1>
            <div className="status-selector">
            <ul>
                <li className="status-selector-option" onClick={()=>setSearchParams({"filter":"treasure","status":0})}>Active</li>
                <li onClick={()=>setSearchParams({"filter":"treasure","status":1})}>Successes</li>
                <li onClick={()=>setSearchParams({"filter":"treasure","status":2})}>Failures</li>
            </ul>
            </div>
            {fundJSX}
            
                
                </div>
         </div>
      )

}