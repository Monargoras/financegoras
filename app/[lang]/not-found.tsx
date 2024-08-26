'use client'

import { Button, Title, Text, Container } from '@mantine/core'
import { useParams, useRouter } from 'next/navigation'
import { IconArrowBack } from 'tabler-icons'

export default function NotFound() {
  const { lang } = useParams()
  const router = useRouter()

  return (
    <Container fluid>
      <Title my={24}>{lang === 'de' ? '404 - Nicht Gefunden' : '404 - Not Found'}</Title>
      <Text mb={24}>
        {lang === 'de' ? 'Diese Seite konnte nicht gefunden werden.' : 'Could not find requested page.'}
      </Text>
      <Button
        rightSection={<IconArrowBack size={28} />}
        onClick={() => {
          router.push('/')
        }}
      >
        {lang === 'de' ? 'Zurück zur Startseite' : 'Return to Home'}
      </Button>
    </Container>
  )
}
