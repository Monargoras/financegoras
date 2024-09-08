'use client'

import { Text, Flex, Paper, em } from '@mantine/core'
import Image from 'next/image'
import { useMediaQuery } from '@mantine/hooks'
import classes from './Welcome.module.css'
import { Dictionary } from '@/utils/types'
import FinancegorasImage from '@/assets/FinancegorasDashboard.png'

interface LandingIntroProps {
  dictionary: Dictionary
}

export default function LandingIntro(props: LandingIntroProps) {
  const isMobile = useMediaQuery(`(max-width: ${em(1200)})`)

  return (
    <Paper w="max(min(60dvw, 1000px), 400px)" mx="auto" radius="50%">
      <Flex direction="row" mt="xl" align="center" wrap="wrap" justify={isMobile ? 'center' : 'end'}>
        <Text ta="center" maw="300" className={classes.text}>
          {props.dictionary.landingPage.dashboardImageText}
        </Text>
        <Image
          priority
          src={FinancegorasImage}
          alt="Financegoras Dashboard"
          style={{
            width: 'max(30dvw, 400px)',
            height: 'max(25dvw, 325px)',
            borderRadius: '10%',
            display: 'block',
            border: '3px solid #fff',
            marginLeft: isMobile ? 0 : 24,
          }}
        />
      </Flex>
    </Paper>
  )
}
