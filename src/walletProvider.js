import { initAccessContext } from 'eos-transit'
import scatter from 'eos-transit-scatter-provider'
import AnchorLinkProvider from 'eos-transit-anchorlink-provider'
// import { Api, JsonRpc } from 'eosjs';

class WalletProvider {
    accessContext;
    wallet;

    constructor() {
        this.accessContext = initAccessContext({
            appName: 'bridge_app',
            network: {
                protocol: 'https',
                host: 'node1.eosdsp.com',
                port: 443,
                chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
            },
            walletProviders: [
                scatter(),
                AnchorLinkProvider(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
            ]
        })

        this.wallet = undefined
    }

    // resetEndpoint(endpoint, dspprotocol) {
    //     console.log('endpoint---', endpoint, dspprotocol)
    //     this.accessContext = initAccessContext({
    //         appName: 'my_first_dapp',
    //         network: {
    //             host: endpoint,
    //             protocol: dspprotocol,
    //             chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    //             port: 443
    //         },
    //         walletProviders: [
    //             scatter(),
    //             AnchorLinkProvider(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
    //         ]
    //     })
    //     const walletType = localStorage.getItem("walletType")
    //     console.log('wallet---type---', walletType)
    //     if (!!walletType) {
    //         let index = parseInt(walletType)
    //         if (index >= 0) {
    //             this.login(index)
    //         }
    //     }
    // }

    async login(index) {
        const walletProviders = this.accessContext.getWalletProviders()
        const selectedProvider = walletProviders[index]
        const wallet = this.accessContext.initWallet(selectedProvider)
        this.wallet = wallet

        await wallet.connect()
        await wallet.login()
    }

    getWallet() {
        return this.wallet
    }

    async disconnectWallet() {
        if (!!this.wallet) {
            await this.wallet.terminate()
            this.wallet = undefined
        }
    }
}

export default new WalletProvider()