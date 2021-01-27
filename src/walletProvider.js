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
                host: 'api.main.alohaeos.com',
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