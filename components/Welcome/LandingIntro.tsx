'use client'

import { Text, Flex, Paper, em, useMantineTheme } from '@mantine/core'
import Image from 'next/image'
import { useMediaQuery } from '@mantine/hooks'
import { IconLock } from 'tabler-icons'
import classes from './Welcome.module.css'
import { Dictionary } from '@/utils/types'
import FinancegorasImage from '@/assets/FinancegorasDashboard.png'

interface LandingIntroProps {
  dictionary: Dictionary
}

export default function LandingIntro(props: LandingIntroProps) {
  const isMobile = useMediaQuery(`(max-width: ${em(1200)})`)
  const theme = useMantineTheme()

  return (
    <>
      <Paper w="max(min(60dvw, 1000px), 400px)" mx="auto" radius="50%" mt="xl">
        <Flex direction="row" align="center" wrap="wrap" justify={isMobile ? 'center' : 'end'}>
          <Text ta="center" maw="300" className={classes.textLeft}>
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
      <Paper w="max(min(60dvw, 1000px), 400px)" h="max(min(20dvh, 600px), 350px)" mx="auto" radius="50%" mt="xl">
        <Flex direction={isMobile ? 'column' : 'row'} align="center" wrap="wrap" justify="center" h="100%">
          <IconLock
            color={theme.colors[theme.primaryColor][5]}
            style={{
              width: isMobile ? 'max(5dvw, 50px)' : 'max(10dvw, 100px)',
              height: isMobile ? 'max(5dvw, 50px)' : 'max(10dvw, 100px)',
            }}
          />
          <Text ta="center" maw={isMobile ? '300' : '400'} className={classes.textRight}>
            {props.dictionary.landingPage.dataSecurityText}
          </Text>
        </Flex>
      </Paper>
    </>
  )
}