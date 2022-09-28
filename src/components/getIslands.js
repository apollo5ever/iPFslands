import to from "await-to-js";
import React from "react";
import hex2a from "./hex2a";



export default async function getIslands(state,i){
console.log("state",state)
console.log("i",i)   
        var islands=[]
       
        const deroBridgeApi = state.deroBridgeApiRef.current
        const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
                scid:state.scid,
                code:false,
                variables:true
        }))
        var search= new RegExp(`.*_M`)
        
        var scData = res.data.result.stringkeys 
   
       let islandList= Object.keys(scData)
        .filter(key => search.test(key))
        .map(key=>hex2a(scData[key]))
        
       console.log("islandList",islandList)
        
        for(let i = 0; i<islandList.length; i++){
     
         for await (const buf of state.ipfs.cat(islandList[i].toString())){
           let island = JSON.parse(buf.toString())
           console.log(island)
           islands.push(island)
           console.log(islands)
         }
        }
        console.log(err)
        console.log(res)    

   console.log("islands final",islands)
if(i){
    return( islands.filter(x=>x.name==i))
}
    else return(islands)
}