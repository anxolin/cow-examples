import { OrderKind } from "@gnosis.pm/cow-sdk";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CowSdk } from '@gnosis.pm/cow-sdk'
import {ethers} from 'ethers'

const EXPLORER_URL = 'https://explorer.cow.fi/orders'
const ORDER_BASE_DEFAULT = {
  kind: OrderKind.SELL, // Sell order (could also be BUY)
  sellToken: '0xc778417e063141139fce010982780140aa0cd5ab', // WETH
  buyToken: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',  // USDC
  amount: '10000000000000000', // 0.001 WETH
  userAddress: '0x1811be0994930fe9480eaede25165608b093ad7a', // Trader
  validTo: 2524608000,
}



const provider = new ethers.providers.Web3Provider(window.ethereum)

export function PostOrders() {
  const [connectedAccount, setConnectedAccount] = useState(false)
  const [cowSdk, setCowSdk] = useState()

  const [orderBase, setOrderBase] = useState(ORDER_BASE_DEFAULT)
  const [orderQuote, setOrderQuote] = useState()
  const [signedOrder, setSignedOrder] = useState()
  const [orderUid, setOrderUid] = useState()  

  const { kind, sellToken, buyToken, amount, userAddress, validTo } = orderBase
  const isSell = kind === OrderKind.SELL

  const connect = () => {
    provider.send("eth_requestAccounts", [])
      .then(async accounts => {
        const account = accounts[0]
        setConnectedAccount(account)
        const { chainId } = await provider.getNetwork()
        const cowSdk = new CowSdk(chainId, { signer: provider.getSigner() })
        setCowSdk(cowSdk)

        console.log(`Connected to ${chainId} using ${account}. SDK: `, cowSdk)
      })
      .catch(e => console.error('Error connecting', e))
  }

  const getQuote = () => {
    if (!cowSdk) return

    cowSdk.cowApi.getQuote(orderBase)
      .then(quote => {
        setOrderQuote(quote)
      })
      .catch(error => console.error('Error getting quote for ', orderBase, error))    
  }

  const signOrder = () => {
    if (!cowSdk || !orderQuote) return

    const rawOrder = orderQuote.quote
    cowSdk.signOrder(rawOrder)
      .then(signed => {
        setSignedOrder({
          ...rawOrder,
          ...signed
        })
      })
      .catch(error => console.error('Error signing order', rawOrder, error))
  }

  const postOrder = () => {
    if (!cowSdk || !signedOrder) return

    cowSdk.cowApi
      .sendOrder({
        order: signedOrder,
        owner: connectedAccount,
      })
      .then(setOrderUid)
      .catch(error => console.error('Error posting signed order', signedOrder, error))
  }

  const setValue = (event) => {
    let name, value

    const target = event.target;  
    if (target.type === 'radio') {
      name = 'kind'
      value = target.id === 'kindSell' ? OrderKind.SELL : OrderKind.BUY
    } else {
      name = target.id
      value = target.value
    }

    setOrderBase({
      ...orderBase,
      [name]: value
    })
  }

  return (
    <>
      <h3>Post an order</h3>

      {!connectedAccount ? (
        <button type="button" onClick={connect}>Connect Wallet</button>
      ): (
        <div className="form">
          <p>
          Connected with <strong>{connectedAccount}</strong>
          </p>
          <h3>New Order</h3>
          <div>
            <label htmlFor="kindSell">Sell Order</label>
            <input type="radio" id="kindSell" checked={isSell} onChange={setValue} />
            <label htmlFor="kindBuy">Sell Order</label>
            <input type="radio" id="kindBuy" checked={!isSell} onChange={setValue} />
          </div>
          <div>
            <label htmlFor="sellToken">Sell Token:</label>
            <input type="text" id="sellToken" value={sellToken} onChange={setValue} size="50" />
          </div>    
          <div>
            <label htmlFor="buyToken">Buy Token:</label>
            <input type="text" id="buyToken" value={buyToken} onChange={setValue} size="50" />
          </div>
          <div>
            <label htmlFor="amount">Amount:</label>
            <input type="text" id="amount" value={amount} onChange={setValue} size="25" />
          </div>
          <div>
            <label htmlFor="userAddress">User Address:</label>
            <input type="text" id="userAddress" value={userAddress} onChange={setValue} size="50" />
          </div>
          <div>
            <label htmlFor="validTo">Valid To:</label>
            <input type="text" id="validTo" value={validTo} onChange={setValue} />
          </div>

          {orderQuote && (
            <>
              <h3>Quote</h3>
              <div>
                <label htmlFor="expiration">Quote expiration:</label>
                <input readOnly type="text" id="expiration" value={orderQuote.expiration} size="35" />              
              </div>
              <div>
                <label htmlFor="expiration">Buy Amount:</label>
                <input readOnly type="text" id="expiration" value={orderQuote.quote.buyAmount} size="35" />              
              </div>
              <div>
                <label htmlFor="expiration">Sell Amount:</label>
                <input readOnly type="text" id="expiration" value={orderQuote.quote.sellAmount} size="35" />              
              </div>
            </>
          )}

          {signedOrder && (
            <>
              <h3>Signed Order</h3>
              <div>
                <label htmlFor="signature">Signature:</label>
                <input readOnly type="text" id="signature" value={signedOrder.signature} size="150" />
              </div>
              <div>
                <label htmlFor="signingScheme">Signing scheme:</label>
                <input readOnly type="text" id="signingScheme" value={signedOrder.signingScheme} size="35" />
              </div>

              <div>
                <label htmlFor="rawSignedOrder">Raw Signed order:</label>
                <textarea id="rawSignedOrder" readOnly value={JSON.stringify(signedOrder, null, 2)} rows="10" cols="150" />
              </div>
            </>
          )}

          {orderUid && (
            <>
              <h3>🎉🍾🎊 Success!</h3>
              <p>
                The order has been posted. Check the status of your order in{' '}
                <a href={EXPLORER_URL + '/' + orderUid} target="_blank" rel="noreferrer">
                  CoW Explorer
                </a>
              </p>
            </>
          )}

        
          <button type="button" onClick={getQuote}>💲 Get quote</button>
          {orderQuote && <button type="button" onClick={signOrder}>✍️ Sign Order</button>}
          {signedOrder && <button type="button" onClick={postOrder}>🚀 Post order</button>}
        </div>
      )}
          
      <hr />
      <br />
      <nav>
        <Link to="/">Go back</Link>
      </nav>
    </>
  )
}
