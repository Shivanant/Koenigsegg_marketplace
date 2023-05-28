import { useEffect, useState } from "react";
import { ethers } from "ethers";


const Home=({marketplace,nft})=>{
    const [items,setItems]=useState([])
    const [loading, setLoading] = useState(true)
    
    const loadmarketplaceitems=async()=>{
         let items=[];
        for(let i=1;i<=8;++i){
            let itm= await marketplace.items(i);

            if(!itm.sold){
                let uri = await nft.tokenURI(i);
                let response= await fetch(uri)
                let metadata= await response.json();

                let totalPrice= itm.price;

                items.push({
                    totalPrice,
                    image:metadata.image,
                    itemId:itm.itemid,
                    description: metadata.description,
                    name:metadata.name
                })

            }
        }
        setItems(items)
        setLoading(false)
    }

    const buyMarketplaceItem = async (itm) => {
      console.log("this is buyMarketplaceItem")
      console.log(itm);

      await(await marketplace.purchaseItem(itm.itemId, {
        value: itm.totalPrice
      })).wait();

      loadmarketplaceitems();
    };

    useEffect(() => {
      loadmarketplaceitems()
    },[]);
    return(<div>
     {
      (loading)?<div className="loading"></div>:       
       (items.length>0)?
        <div className="cards">
        {
            items.map((itm)=>(

              <div className="card" >
              <div className="image">
                 <img src={itm.image} ></img>
              </div>
              <div className="information">
              <h2>{itm.name} </h2>
              <p>{itm.description}</p>
              
              </div>
              <button onClick={()=>{
                buyMarketplaceItem(itm)
              }}><i className="fa-brands fa-ethereum"></i>  {ethers.utils.formatEther(itm.totalPrice)}</button>
              </div>
                

            ))
        }
            
        
        </div>
        :
        <div className="no-items" ><h1>No Items Here</h1> </div>
    }
    </div>
      
    )
}
export default Home;


// import { useState,useEffect } from 'react';
// import { ethers } from 'ethers';


// const Home= ({marketplace,nft})=>{

//     const [items,setItems]=useState([]);

//     const loaditems=async()=>{


            

//     }
//     const buyMarketplaceItem = async (itm) => {
        
//         await(await marketplace.purchaseitem(itm, {
//           value: itm.totalPrice
//         })).wait()
  
//         await loaditems();
//       };
//       useEffect(()=>{
//         loaditems();
//       })


//     return (
    
//     <div className='cards'>
        
//             {items.map((item,idx)=>(
//                 <div className='card' id={idx}key={idx}>
//                 <img src={item.image} alt='car'>
//                 </img>
//                 <p className='info'>
//                     {item.description}
//                 </p>
//                 <button onClick={buyMarketplaceItem}>{ethers.utils.formatEther(item.totalPrice)}</button>
//             </div>

//             ))}
//         </div>);
// }
// export default Home;