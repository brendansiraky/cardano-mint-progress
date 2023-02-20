import { BlockFrostAPI } from '@blockfrost/blockfrost-js'

const API = new BlockFrostAPI({
    projectId: process.env.BLOCKFROST_API_KEY,
    network: 'mainnet',
})

const getAssets = async (page = 1, policyAddress) => {
    try {
        const assets = await API.assetsPolicyById(policyAddress, {
            page
        })
        return assets
    } catch (error) {
        console.error(error)
    }
}

const getTotalMintedAssets = async (policyAddress, totalAssets) => {
    const count = totalAssets / 100
    const delay = async time => new Promise(res => setTimeout(res, time))

    let assetCount = 0
    let limitReached = false
    
    for (let i = 0; i < count; i++) {
        if (!limitReached) {
            await delay(50).then(async () => {
                const assets = await getAssets(i + 1, policyAddress)
                if (assets.length > 0) {
                    assetCount = assetCount + assets.length
                } else {
                    limitReached = true
                }
            })
        }
    }

    return assetCount
}

export default async function handler(req, res) {
    try {
        const totalMintedAssets = await getTotalMintedAssets(
            process.env.POLICY_ADDRESS,
            process.env.NEXT_PUBLIC_MAX_SUPPLY
        )
        res.status(200).json(totalMintedAssets)
    } catch (error) {
        console.error(error)
    }
}