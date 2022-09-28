import React from 'react'
import { useParams } from 'react-router-dom'
import { LoginContext } from '../LoginContext';
import {NavLink} from 'react-router-dom'




export default function Post(props){
  window.scrollTo(0, 0)
  let params = useParams();
  
  
  const [post,setPost]=React.useState(props.post)
  const [state, setState] = React.useContext(LoginContext);

  

    
      
    



    return(<>
        <div>

          <NavLink to={`/island/${params.island}`}>{params.island}</NavLink>
          
         <div className="post">
          <h1>{props.post.title}</h1>
          
          <p dangerouslySetInnerHTML={{__html: props.post.content}} />
            </div> 
            
            </div>
       
        </>
    )
}