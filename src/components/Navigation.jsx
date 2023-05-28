import { NavLink } from "react-router-dom";
import '../App';

const Navigation=({account,web3Handler})=>{
  return(<div>
     <nav>

<div className="logo-car">
   KOENIGSEGG
</div>
<div className="nav-elements">
   <NavLink to="/">
       Home
   </NavLink>
   <NavLink to='/mypurchase'>
       Myitems
   </NavLink>
   <NavLink to="/About" >
       About
   </NavLink>

</div>
<div className="button">
   {(account)?(<button>{
        account.slice(0,4)}...{account.slice(12,16)}
   </button>):<button onClick={web3Handler}>Connect</button>

   }
   
</div>

</nav>

  </div>
  
 
  )
}

export default Navigation;