import { Link } from "react-router-dom";
import { CowSdk } from '@gnosis.pm/cow-sdk'
import { useEffect, useState } from 'react';

const EXPLORER_URL = 'https://explorer.cow.fi/orders'

const chainId = 1
const cowSdk = new CowSdk(chainId)

export function Orders() {
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
        {orders.map(order => {
          console.log(order)
          return (
            <li key={order.uid}>
              <a href={EXPLORER_URL + '/' + order.uid} target="_blank" rel="noreferrer">
                {order.uid}
              </a>
            </li>
          )
        })}
        
      </ul>
      <nav>
        <Link to="/">Go back</Link>
      </nav>
    </>
  )
}
