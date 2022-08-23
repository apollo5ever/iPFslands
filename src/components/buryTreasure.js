
import DeroBridgeApi from '../api.js'
import React from 'react'
import ReactDOM from 'react-dom'
import to from 'await-to-js'
import sha256 from 'crypto-js/sha256'

import { LoginContext } from '../LoginContext';


export default function BuryTreasure() {

    
    
    const [state, setState] = React.useContext(LoginContext);




 



  const DoIt = React.useCallback(async (event) => {
    event.preventDefault();

    const deroBridgeApi = state.deroBridgeApiRef.current
    const [err0, res0] = await to(deroBridgeApi.daemon('get-sc', {
            scid:state.scid,
            code:false,
            variables:true
    }))
  
 
    



    var search= sha256(event.target.island.value).toString()+"_Owner"
    console.log("search",search)
    var owner = res0.data.result.stringkeys[search]
    console.log(owner)

    var index = 0
    var burn = 100000
    if(!owner){
       burn = 1000000
       
    }else{
      var search2= new RegExp(`${sha256(event.target.island.value).toString()}.*_Treasure`)
      console.log(search2)
      let bountyList = Object.keys(res0.data.result.stringkeys)
      .filter(key => search2.test(key))
      console.log(bountyList)
      index = bountyList.length
    }
    var expiry = new Date(event.target.expiry.value).getTime()/1000
    

    var obj = {
      "name": event.target.fundName.value,
      "expiry": expiry,
      "tagline": event.target.tagline.value,
      "index": index,
      "description": event.target.description.value,
      "image":event.target.fundPhoto.value,
      "island":event.target.island.value
      

    }

    var data = JSON.stringify({
      "pinataOptions": {
        "cidVersion": 0
      },
      "pinataMetadata": {
        "name": event.target.island.value+" buried treasure "+event.target.index.value+" "+event.target.name.value,
        "keyvalues": {
        }
      },
      "pinataContent": obj
    });


 

    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json','authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhNjc5NzU5MS02OGUxLTQyNzAtYjZhMy01NjBjN2Y3M2IwYTMiLCJlbWFpbCI6ImJhY2tlbmRAYW1icm9zaWEubW9uZXkiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMDgzZTJkMGQ2Yzg2YTBhNjlkY2YiLCJzY29wZWRLZXlTZWNyZXQiOiJlN2VlMTE4MWM2YTBlN2FmNjQ0YmUzZmEyYmU1ZWY5ZWFmMmNmMmYyYzc0NWQzZGIxNDdiMThhOTU5NWMwZDNlIiwiaWF0IjoxNjYxMTk1NjUxfQ.9Pz2W_h7zCiYyuRuVySKcDwA2fl_Jbm6QDulihAIpmo`
     },
      
            body:  data
    });

    const addObj= await state.ipfs.add(JSON.stringify(obj).toString())
    const metadata =addObj.cid.toString()
    console.log(addObj)
    console.log(metadata)
    



   
  
  
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
      "scid": state.scid,
      "ringsize": 2,
      "transfers": [
        {
          "scid": state.scid,
          "burn": burn
        },{
          "destination":state.randomAddress,
          "burn":parseInt(event.target.treasure.value*100000)

        }
      ],
      "sc_rpc": [{
        "name": "entrypoint",
        "datatype": "S",
        "value": "BT"
      },

      {
        "name": "H",
        "datatype": "S",
        "value": sha256(event.target.island.value).toString()
      },
      {
        "name": "i",
        "datatype": "U",
        "value": index
      },
      {
        "name": "J",
        "datatype": "S",
        "value": event.target.judge.value
      },
      {
        "name": "E",
        "datatype": "U",
        "value": expiry
      },
      {
        "name": "S",
        "datatype": "U",
        "value": 1
      },
      {
        "name": "M",
        "datatype": "S",
        "value": "M"
      },
     
      {
        "name": "m",
        "datatype" : "S",
        "value": metadata
      }
      ]
    }))


    console.log(err)
    console.log(res)

   



  

  })



  return (
    <div className="function">
      <div className="profile">
      
      <h3>Bury Treasure</h3>
      <p>When you bury treasure on your private island, you are creating a bounty for some specific goal. Specify the criteria for release of treasure, and appoint a judge (it can be you) to decide when that criteria has been met.</p>
      <p>If you already own an island, adding a Buried Treasure Bounty costs 1 Coco. Please ensure island name matches exactly, or it will be considered fraudulent and won't be displayed. If you don't already have an island, this will create one for you and it will cost you 10 Coco.</p>
      
      <form onSubmit={DoIt}>
        <input placeholder="Island (case-sensitive)" id="island" type="text" />
        
        <input placeholder="Name" id="fundName" type="text" />
        <input placeholder="Image URL" id="fundPhoto" type="text"/>
        <input placeholder="Tagline" id="tagline" type="text" />
        <input placeholder="Initial Bounty (Dero amount)" id="treasure" type="text"/>
        <p>Expiry</p>
        <input type="date" id="expiry" name="expiry"></input>
        
      
        <textarea placeholder="Description (include precise criteria)" rows="44" cols="80" id="description"/>
        <input placeholder="Judge (Dero Address)" id="judge" type="text" />
        
        <button type={"submit"}>Create</button>
      </form>
    </div>
    </div>
  )
}
