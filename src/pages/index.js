import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Landing.module.scss'
import { Progress } from '@/components/progress/Progress'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

const maxSupply = process.env.NEXT_PUBLIC_MAX_SUPPLY

export default function Home() {
    const [minted, setMinted] = useState(0)

    useEffect(() => {
        fetchMinted()
        setInterval(async () => {
            fetchMinted()
        }, 60000)
    }, [])

    async function fetchMinted() {
        const response = await fetch(`/api/minted`)
        const result = await response.json()
        setMinted(result)
    }

    function getMintedPercentage() {
        return ((minted / maxSupply) * 100).toFixed(2)
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
                <div className={styles.content}>
                    <h2 className={inter.className}>YAYA IZENOBBY</h2>
                    <h1 className={inter.className}>{minted} / {maxSupply}</h1>
                    <h2 className={inter.className}>{getMintedPercentage()}%</h2>
                    <Progress 
                        progress={minted} 
                        max={maxSupply}    
                    />
                </div>
            </main>
        </>
    )
}
