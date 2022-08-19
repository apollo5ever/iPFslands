
import DeroBridgeApi from '../api.js'
import React from 'react'
import ReactDOM from 'react-dom'
import to from 'await-to-js'
import sha256 from 'crypto-js/sha256'


import { LoginContext } from '../LoginContext';


export default function CreateFund() {

    
    
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
      var search2= new RegExp(`${sha256(event.target.island.value).toString()}.*_sm`)
      console.log(search2)
      let fundList = Object.keys(res0.data.result.stringkeys)
      .filter(key => search2.test(key))
      console.log(fundList)
      index = fundList.length
    }
    var deadline = new Date(event.target.deadline.value).getTime()/1000
    console.log("DATE",deadline)

    var obj = {
      "name": event.target.fundName.value,
      "goal": event.target.goal.value,
      "deadline": deadline,
      "tagline": event.target.tagline.value,
      "index": index,
      "description": event.target.description.value,
      "image":event.target.fundPhoto.value,
      "island":event.target.island.value
      

    }

    
 
      console.log("fund id",await state.ipfs.id())
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
        }
      ],
      "sc_rpc": [{
        "name": "entrypoint",
        "datatype": "S",
        "value": "NF"
      },

      {
        "name": "G",
        "datatype": "U",
        "value": parseInt(event.target.goal.value) * 100000
      },
      {
        "name": "D",
        "datatype": "U",
        "value": deadline
      },
      {
        "name": "A",
        "datatype": "S",
        "value": event.target.address.value
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
        "name": "M",
        "datatype" : "S",
        "value": "m"
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
      
      
      
      <h3>Add a Smoke Signal</h3>
      <p>If you already own an island, adding a smoke signal costs 1 Coco. Please ensure island name matches exactly, or it will be considered fraudulent and won't be displayed. If you don't already have an island, this will create one for you and it will cost you 10 Coco.</p>
      <form onSubmit={DoIt}>
        <input placeholder="Island (case-sensitive)" id="island" type="text" />
        <input placeholder="Name" id="fundName" type="text" />
        <input placeholder="Image URL" id="fundPhoto" type="text"/>
        <input placeholder="Tagline" id="tagline" type="text" />
        <p>Deadline</p>
        <input type="date" id="deadline" name="deadline"></input>
        
        <textarea placeholder="Description" rows="44" cols="80" id="description"/>
        <input placeholder="Goal" id="goal" type="text" />
        <input placeholder="Address" id="address" type="text" />
        <button type={"submit"}>Create</button>
      </form>
    </div>
    </div>
  )
}
