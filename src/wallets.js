import * as React from 'react'
import WalletProvider from './walletProvider'


const { useState } = React

const ConnectModal = (props) => {
    const { closeModal, successModal} = props
    // const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)
    const [active, setActive] = useState(-1)

    const connectWallet = async (index) => {

        try {
            setActive(index)
            setLoading(true)
            await WalletProvider.login(index)
            localStorage.setItem('walletType', index.toString())
            const wallet = WalletProvider.getWallet()
            console.log("wallet11-----", wallet)
            successModal(wallet?.auth?.accountName)

        } catch (e) {
            console.log('something went wrong ', e)
            // dispatch(showNotification({ notificationText: 'Failed to connect', notificationType: 2 }))
        } finally {
            setLoading(false)
            setActive(-1)
        }
    }

    return (
        <div className='container'>
            <div>
                Connect wallet

                <div className="closeBtn" onClick={closeModal}>
                    <p className="close-text">close</p>
                </div>
            </div>
            <div>
                <button onClick={() => connectWallet(0)} disabled={loading}>
                    {loading && active === 0 ?  "connecting" : "Connect with scatter"}
                </button>
            </div>
            <div>
                <button onClick={() => connectWallet(1)} disabled={loading}>
                    {loading && active === 1 ?  "connecting" : "Connect with Anchor"}
                </button>
            </div>
        </div>
    )
}

export default ConnectModal