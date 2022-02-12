import './App.css';
import { CowSdk } from '@gnosis.pm/cow-sdk'
import { useEffect, useState } from 'react';

const chainId = 1
const cowSdk = new CowSdk(chainId)
const EXPLORER_URL = 'https://explorer.cow.fi/orders'

function App() {
  const [orders, setOrders] = useState([])

  useEffect(()=> {
    cowSdk.cowApi.getOrders({
      owner: '0x00000000005ef87f8ca7014309ece7260bbcdaeb', // Trader
      limit: 5,
      offset: 0
    }).then(setOrders).catch(console.error)
  }, [])
  
  return (
    <>
      <h3>Last 5 orders</h3>
      <ul>
        {orders ? orders.map(order => {
          console.log(order)
          return <li key={order.uid}><a href={EXPLORER_URL + '/' + order.uid} target="_blank" rel="noreferrer">{order.uid}</a></li>
        }): 'No orders'}
        
      </ul>
    </>
  )
}

export default App;
