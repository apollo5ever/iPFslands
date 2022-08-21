import React from 'react'
import { useParams } from 'react-router-dom';
import { LoginContext } from '../LoginContext';
import to from 'await-to-js'
import sha256 from 'crypto-js/sha256'


export default function Treasure() {

  const [treasure,setTreasure] = React.useState({})
  const params = useParams()
  const island = params.island
  const index = params.index
  const [state, setState] = React.useContext(LoginContext);

 

  const AddTreasure =React.useCallback(async (event) =>{
    event.preventDefault();

    const deroBridgeApi = state.deroBridgeApiRef.current

    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
      "scid": state.scid,
      "ringsize": 2,
      "transfers": [
        {
          "destination":state.randomAddress,
          "burn":parseInt(event.target.amount.value)*100000

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
        "value": sha256(island).toString()
      },
      {
        "name": "i",
        "datatype": "U",
        "value": parseInt(index)
      },
      {
        "name": "J",
        "datatype": "S",
        "value": "J"
      },
      {
        "name": "E",
        "datatype": "U",
        "value": 0
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
        "value": "m"
      }
      ]
    }))
  })

  function hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

  const getFunds = React.useCallback(async () => {
     
    const deroBridgeApi = state.deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
            scid:state.scid,
            variables:true,
            keysstring:[sha256(island)+index+"_bm",sha256(island)+index+"_Treasure"]
    }))
    
   // res.data.result.stringkeys[sha256(island).toString()+index+"_M"]

    var search= new RegExp(`${sha256(island).toString()+index}_bm`)
     console.log("search",search)
     var scData = res.data.result.stringkeys //.map(x=>x.match(search))

     let fundList= Object.keys(scData)
     .filter(key => search.test(key))
     .map(key=>[hex2a(scData[key]),scData[key.substring(0,66)+"Expiry"],scData[key.substring(0,66)+"Treasure"],scData[key.substring(0,66)+"Judge"],key.substring(0,65)])
     
     console.log("hash array",fundList)
     
     for(let i = 0; i<fundList.length; i++){
    console.log("helllooo",state.ipfs)
    console.log("funds",treasure)
    console.log("fundList",fundList)
      for await (const buf of state.ipfs.cat(fundList[i][0].toString())){
        let fund = JSON.parse(buf.toString())
        console.log(fund.island)
        console.log(sha256(fund.island).toString())
        console.log(fundList[i][4].substring(0,64))
       if(sha256(fund.island).toString()!=fundList[i][4].substring(0,64)) continue
       
        fund.index=fundList[i][4].substring(64,65)
        fund.expiry = fundList[i][1]
        fund.treasure = fundList[i][2]/100000
        fund.judge = fundList[i][3]
        
        if(fund.expiry> new Date().getTime()/1000) fund.status=0
     
        setTreasure(fund)
        
      }
     }

    console.log("res",res)
  }
  )





  const ClaimTreasure = React.useCallback(async (event) =>{
    event.preventDefault()
    console.log(treasure.judge)
    var hash = sha256(params.island).toString()
    const deroBridgeApi = state.deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {

       "ringsize": 16,
      "transfers":[
        {"destination":hex2a(treasure.judge),
      
"payload_rpc":[
        {
                "name": "C",
                "datatype": "S",
                "value": "Treasure Claim Submitted by: " +state.userAddress
        },
        {
          "name":"POC",
          "datatype":"S",
          "value":event.target.proof.value
        }
]
        }
      ],
      
      
     
   
  }))

  })
   
  
  const supportGoal = React.useCallback(async (event) => {
    event.preventDefault()
    var HashAndIndex = sha256(params.island)+params.index
    if(event.target.refundable.checked){
      var refundable =1
    }else {
      var refundable =0
    }
console.log(HashAndIndex,refundable,state.scid,state.randomAddress)
   


    const deroBridgeApi = state.deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
      "scid": state.scid,
      "ringsize": 2,
      "transfers": [{
         "burn": (parseInt((event.target.amount.value)*100000)),
         "destination":state.randomAddress
       }],
      "sc_rpc": [{
          "name": "entrypoint",
          "datatype": "S",
          "value": "SG"
      },
      {
          "name": "H",
          "datatype": "S",
          "value": HashAndIndex
      },
      {
        "name":"R",
        "datatype": "U",
        "value" : refundable
      }
  ]
  }))
  })



    

      React.useEffect(() => {
        console.log("executed only once!");
        
        getFunds();
      }, [state.deroBridgeApiRef]);
    
    return (<div className="function">
        <div className="profile" >
          
          <img src={treasure.image}/>
            <h1>{treasure.name}</h1>
            <h3>Treasure: {treasure.treasure} Dero</h3>
            <h3>{treasure.tagline}</h3>
            
            <p dangerouslySetInnerHTML={{__html: treasure.description}} />
            <form onSubmit={AddTreasure}>
              <input placeholder="Amount (Dero)" id="amount"/>
              <button type={"submit"}>Add Treasure</button>
              
            </form>
            <form onSubmit={ClaimTreasure}>
              <button type={"submit"}>Claim Treasure</button>
              <input placeholder="proof" id="proof"/>
            </form>
            

            
        </div></div>
    )
} 