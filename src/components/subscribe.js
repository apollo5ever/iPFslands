import React from 'react'

import to from 'await-to-js'


export default function Subscribe(props) {

 

    const [availability,setAvailability] = React.useState("")
    const [subbed,setSubbed] = React.useState(false)
    const [expiry,setExpiry] = React.useState(null)

    const checkAvailability = React.useCallback(async () => {
        
        const deroBridgeApi = props.dba.current
        const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
            scid: props.scid,
            code: false,
            variables: true
        }))
        const obj = res.data.result.stringkeys
       let search = props.profile +props.index+"_Av"
       let avail = obj[search]
       console.log("avail",avail)
        setAvailability(avail)
        

        
        

    })

    const checkSubbed = React.useCallback(async ()=>{
        const deroBridgeApi = props.dba.current

        
        const [err0, res0] = await to(deroBridgeApi.daemon('get-sc', {
                scid:props.scid,
                code:false,
                variables:true
        }))
        var scData = res0.data.result.stringkeys
        var supporterSearch = `${props.userAddress}_${props.profile+props.index}_E`
        var expiry = scData[supporterSearch]
        if(expiry> new Date().getTime()/1000){
             setSubbed(true)
             setExpiry(Math.round((expiry-new Date().getTime()/1000)/(60*60*24)))
        }
   
    })

    const [error,setError]=React.useState("")

    const topUp = React.useCallback(async (event) => {
        event.preventDefault();
       
        setError("");

        const deroBridgeApi = props.dba.current


        const TierHash = props.profile+props.index.toString()
        const SupporterHash = props.userAddress
     
        
         const [err0, res0] = await to(deroBridgeApi.wallet('start-transfer', {
             "scid": props.scid,
             "ringsize": 2,
             "transfers": [{
                "burn": (parseInt((event.target.amount.value)*100000)),
                "destination":props.randomAddress
              }],
             "sc_rpc": [{
                 "name": "entrypoint",
                 "datatype": "S",
                 "value": "TU"
             },
             {
                 "name": "T",
                 "datatype": "S",
                 "value": TierHash
             },
             {
                 "name": "S",
                 "datatype": "S",
                 "value": SupporterHash
             }
         ]
         }))
     
         console.log(err0)
         console.log(res0)
         } )

    const subscribe = React.useCallback(async (event) => {
        event.preventDefault();
       
        setError("");

        const deroBridgeApi = props.dba.current


        const TierHash = props.profile+props.index.toString()
        const SupporterHash = props.userAddress
     
        
         const [err0, res0] = await to(deroBridgeApi.wallet('start-transfer', {
             "scid": props.scid,
             "ringsize": 2,
             "transfers": [{
                "burn": (parseInt((event.target.amount.value)*100000)),
                "destination":props.randomAddress
              }],
             "sc_rpc": [{
                 "name": "entrypoint",
                 "datatype": "S",
                 "value": "AS"
             },
             {
                 "name": "T",
                 "datatype": "S",
                 "value": TierHash
             },
             {
                 "name": "S",
                 "datatype": "S",
                 "value": SupporterHash
             }
         ]
         }))
     
         console.log(err0)
         console.log(res0)
         setTimeout(()=>{
            checkAvailability()
         },10000)
         
         } )
         React.useEffect(() => {
            console.log("executed only once!");
            checkAvailability();
            checkSubbed();
          }, []);

    return(
        <div className="subscribe">
            <h3>{props.name}</h3>
            <p>{props.amount/100000} Dero per {Math.round(props.interval/(60*60*24))} days</p>
            <p>Perks: {props.perks}</p>
            <p>Available Spots: {availability}
             </p>
           { subbed?<form onSubmit={topUp}>
            <p>You are subscribed to this tier. Your subscription ends in {expiry} days.</p>
                <input placeholder="Dero Amount" id="amount" type="text"/>
                <button type={"submit"}>Top Up</button>
            </form>:
           <form onSubmit={subscribe}>
                <input placeholder="Dero Amount" id="amount" type="text"/>
                <button type={"submit"}>Subscribe</button>
            </form>}
           <div className="error"> {error}</div>
        </div>
    )
}