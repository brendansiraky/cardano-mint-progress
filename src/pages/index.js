import { useEffect, useState } from 'react' 
import Head from 'next/head'
import ReactCountdown from 'react-countdown'
import styles from '@/styles/Landing.module.scss'
import { Progress } from '@/components/progress/Progress'

const maxSupply = process.env.NEXT_PUBLIC_MAX_SUPPLY

const EXCHANGE_RATE = 0.51
const MINT_PRICE_ADA = 99
const MINT_PRICE_AUD = MINT_PRICE_ADA * EXCHANGE_RATE

const INTERVAL = 20000

export default function Home() {
    const [minted, setMinted] = useState(0)
    const [isLoading, setIsLoading] = useState(false);
    const [countdownDate] = useState(Date.now() + INTERVAL)

    useEffect(() => {
        setInterval(async () => {
            fetchMinted()
        }, INTERVAL)
    }, [])

    async function fetchMinted() {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/minted`)
            const result = await response.json()
            setIsLoading(false)
            setMinted(result)
        } catch (error) {
            setIsLoading(false)
        }
    }

    function getMintedPercentage() {
        return ((minted / maxSupply) * 100).toFixed(2)
    }

    function formatDollarFigure(number) {
        return `$${new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number)}`
    }

    function formatAdaFigure(number) {
        return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number)
    }

    function getHumanUrl(minted) {
        if (minted < 500) {
            return '/human-sad.png'
        }
        if (minted < 1000 ) {
            return '/human-neautral.png'
        }

        return '/human-happy.png'
    }

    return (
        <>
            <Head>
                <title>Unphased Minting Progress</title>
                <meta name="description" content="Unphased Minting Progress" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div className={styles.contentWraper}>
                    <h1>UNPHASED</h1>
                    <Progress
                        progress={minted} 
                        max={maxSupply}    
                    />
                    <h2>{minted} / {maxSupply}</h2>
                    <h2>{getMintedPercentage()}%</h2>
                </div>
                <div className={styles.imageWrapper} style={{ backgroundImage: `url(${getHumanUrl(minted)})` }} />
                <div className={styles.totalWrapper}>
                    <h3>ADA: {formatAdaFigure(MINT_PRICE_ADA * minted)}</h3>
                    <h3>AUD: {formatDollarFigure(MINT_PRICE_AUD * minted)}</h3>
                    <ReactCountdown 
                        date={countdownDate}
                        renderer={(props) => {
                            const { seconds } = props.formatted
                            return (
                                <h3>Refreshing: {isLoading.toString()}</h3>  
                            )
                        }}
                    />
                </div>
                {minted === maxSupply || minted > maxSupply && <div className={styles.success}>
                    <h1>SUCCESS!!! YAYA IZANOBBY</h1>
                </div>}
            </main>
        </>
    )
}
