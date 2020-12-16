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
                host: 'api.kylin.alohaeos.com',
                port: 443,
                chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'
            },
            walletProviders: [
                scatter(),
                AnchorLinkProvider(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
            ]
        })

        this.wallet = undefined
    }


    async login(index) {
        const walletProviders = this.accessContext.getWalletProviders()
        const selectedProvider = walletProviders[index]
        const wallet = this.accessContext.initWallet(selectedProvider)
        this.wallet = wallet

        await wallet.connect()
        await wallet.login()
    }

    getWallet(){
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