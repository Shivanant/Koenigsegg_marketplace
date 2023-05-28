import { useEffect, useState } from "react";

const Myitems =({marketplace,nft,account})=>{
    const [items,setPurchase]=useState([])
    const [loading,setLoading]=useState(true);
    const loadmarketplaceitems=async()=>{
        let items=[];
        let arr=[];
       for(let i=1;i<=8;++i){
           let item= await marketplace.items(i);
           arr.push(item);
           let a =item.owner.toString();

           if(a === account){
               let uri = await nft.tokenURI(i);
               let response= await fetch(uri)
               let metadata= await response.json();

               let totalPrice= item.price;

               items.push({
                   totalPrice,
                   image:metadata.image,
                   itemId:item.itemid,
                   seller:item.seller,
                   description: metadata.description,
                   name:metadata.name
               })

           }
           
       }
        setPurchase(items)
        setLoading(false)
    }


    useEffect(()=>{
        loadmarketplaceitems()
    })


    return(
        <div>
        {
            (loading)?<div className="loading"></div>:
            (items.length>0)?<div className="cards">
            {
                items.map((itm,idx)=>(
                <div className="card" id={idx}  key={idx} >
              <div className="image">
                 <img src={itm.image} alt={itm.image}></img>
              </div>
              <div className="information">
              <h2>{itm.name} </h2>
              <p>{itm.description}</p>
              
              </div>
              </div>

            ))}
        </div>:<div className="no-items"><h1>No Items Here</h1></div>
        }
        </div>
    )
}
export default Myitems;