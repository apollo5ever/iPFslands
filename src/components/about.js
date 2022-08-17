import React from 'react'

export default function About() {

 


    

      React.useEffect(()=>{
        console.log("refresh token")
      },[])
    
    return (
        <div className="function" >
          <h1>Welcome to Private Islands</h1>

          <h3>Our Mission</h3>
          <p>
            We are building the world's most resilient support network. A place where people can come together to support projects without fear that their funds will be seized or their networks wiped. We've seen legacy platforms like Patreon ban users for differences of opinion. When this happens, creator-supporter relationships are deleted. Here on Private Islands, creator-supporter relationships are stored on the Dero blockchain. We've also seen legacy platforms like GoFundMe confiscate funds over differences of opinion. Here funds are either sent directly to their recipient, or in some cases they are held in a smart contract for a period of time. We've also seen how fundraising with Bitcoin is susceptible to blacklisting and confiscation. That's why we've decided to build on the only private chain with smart contracts, Dero.
          </p>
          <h3>Where We're At</h3>
          <p>This is version 0.7 of Private Islands. It is in alpha stage, and thus far has been put together by one man. It is a functional proof-of-concept. It is changing rapidly.</p>
          <p>
            One of Dero's interesting features is mutable contracts. Many in crypto see immutability as a great virtue, and Dero does have that option too, but having the option for mutability during development is quite handy. The contract is still evolving at this stage. Apollo, the man mentioned earlier, has the ability to do those nasty things that legacy platforms have done. This will change, but for now you have to trust him. Don't worry, he's a good guy.
          </p>
          <p>
            In version 0.7 you can start fundraisers. Supporters can make refundable or non-refundable donations. Non-refundable donations go straight to the recipient. Refundable donations only make it to the recipient if the fundraising goal is met on time. We call fundraisers smoke signals. We're doing an island theme.
          </p>
          <p>
            You also have the ability to create subscription tiers and post exclusive content. Subscriptions can cost whatever you want over whatever interval you want. For example, 1 Dero per year or 100 Dero per day. Content is limited to text at the moment, but that text can include html, so you can post images that way. Just no file uploads yet. This content is stored on a central server accessible by apollo. The goal is to move to a private decentralized storage system. We're looking at SIA.
          </p>
          <p>
            We're also in the process of implementing an experimental form of governance called an OAO. Similar to a DAO but instead of rule by committee it's rule by CEO with a board to keep him in check. The CEO is the only one who can withdraw treasury funds, but the board sets the allowance. The CEO can make changes to contract code, but board must approve it (this for now only applies to the governance contract itself, but if the DVM makes one simple update it will apply to the main contract too).
          </p>
          <h3>How Do I Start?</h3>

          <p>In order to use this website you need two things.</p><ol><li>A Dero wallet running with the rpc-server turned on.</li><li><a href="https://chrome.google.com/webstore/detail/dero-rpc-bridge/nmofcfcaegdplgbjnadipebgfbodplpd" target="_blank" rel="noopener noreferrer">The Dero RPC Bridge Extension (only available for chromium-based browsers like Brave)</a></li></ol> 
          <p>Once you have those, you can subscribe to private island subscription tiers to see their exclusive content. If you'd like to claim your own island, you'll need some coco tokens. It costs 10 coco to claim your island, 1 coco to launch smoke signal fundraisers, and 1 coco to add or modify subscription tiers. Everything else including publishing and editing exclusive content is free. You also earn coco each time you support another island.</p>
            
        </div>
    )
}