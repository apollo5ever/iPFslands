import React from 'react'
import { NavLink } from 'react-router-dom';
import IslandCard from './islandCard';
import { LoginContext } from '../LoginContext';
import to from 'await-to-js';
import { useSearchParams } from 'react-router-dom';
import BountyList from './bountyList';
import FundList from './fundList';
import {default as GI} from './getIslands'
import BottleList from './bottleList';


export default function IslandList(){

    const [islands,setIslands] = React.useState([])
    const [state, setState] = React.useContext(LoginContext);
    const [view,setView]=React.useState("");
    let [searchParams, setSearchParams] = useSearchParams();

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
      return array
  }


    function hex2a(hex) {
      var str = '';
      for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      return str;
  }

    const getIslands = React.useCallback(async () => {
      setIslands([])
     
      const deroBridgeApi = state.deroBridgeApiRef.current
      const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
              scid:state.scid,
              code:false,
              variables:true
      }))
   
      
 
 
 
      var search= new RegExp(`.*_M`)
      console.log("search",search)
      var scData = res.data.result.stringkeys //.map(x=>x.match(search))
 
     let islandList= Object.keys(scData)
      .filter(key => search.test(key))
      .map(key=>hex2a(scData[key]))
      
     
      
      for(let i = 0; i<islandList.length; i++){
   
       for await (const buf of state.ipfs.cat(islandList[i].toString())){
         let island = JSON.parse(buf.toString())
     
        
         //setIslands(islands=>[...islands,island])
         
       }
      }
      console.log(err)
      console.log(res)    
      setIslands(await GI(state))
    })




    React.useEffect(() => {
            getIslands()
      }, [state.ipfs])



     
     const islandJSX = shuffleArray(islands).map(bio => {
         return(<div className="function"> <NavLink to={`/island/${bio.name}?view=main`}><IslandCard  name={bio.name} tagline={bio.tagline} image={bio.image} /></NavLink> </div>)
     })
      return(
        <div className="function">
          <NavLink to={`/archipelago`}><h1>The Archipelago</h1></NavLink>
           <div className="icons">
               <div className="icons-treasure" onClick={()=>{setSearchParams({filter:"treasure"})}}><div className="icons-text">Bounties</div></div><div className="icons-signal" onClick={()=>{setSearchParams({filter:"smokesignals"})}}><div className="icons-text">Fundraisers</div></div><div className="icons-mail" onClick={()=>{setSearchParams({filter:"mib"})}}><div className="icons-text">Subscriptions</div></div>
          </div>
         {!searchParams.get("filter")?<div>
          
          {islandJSX}
                <div className="function"><NavLink to={'/claimIsland'}><IslandCard name="Your Name Here" tagline="Claim Your Private Island" image="http://myaccountancyplace.co.uk/wp-content/uploads/2017/07/mystery-person-with-question-mark.jpg" /></NavLink></div>
         
         </div>
         :searchParams.get("filter")=="treasure"? <BountyList/>
         :searchParams.get("filter")=="smokesignals"?<FundList/>
         :searchParams.get("filter")=="mib"?<BottleList state={state}/>
         :""}
         </div>
      )

}