import * as React from 'react'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your login link for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brandMark}>UrjaSetu</Text>
        <Heading style={h1}>Your login link</Heading>
        <Text style={text}>
          Click the button below to log in to {siteName}. This link will expire
          shortly.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Log In
        </Button>
        <Text style={footer}>
          If you didn't request this link, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'DM Sans', Helvetica, Arial, sans-serif",
  color: '#16233a',
}
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 28px' }
const h1 = {
  fontFamily: "'Manrope', Helvetica, Arial, sans-serif",
  fontSize: '24px',
  lineHeight: '1.25',
  fontWeight: 600 as const,
  color: '#16233a',
  margin: '0 0 16px',
}
const text = {
  fontSize: '15px',
  color: '#16233a',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const link = { color: '#1f4634', textDecoration: 'underline' }
const button = {
  backgroundColor: '#1f4634',
  color: '#ffffff',
  fontFamily: "'Manrope', Helvetica, Arial, sans-serif",
  fontSize: '15px',
  borderRadius: '0px',
  padding: '13px 24px',
  textDecoration: 'none',
  display: 'inline-block',
}
const footer = { fontSize: '12px', color: '#5b6472', lineHeight: '1.6', margin: '28px 0 0', borderTop: '1px solid #e6dcc7', paddingTop: '14px' }
const brandMark = {
  fontFamily: "'Manrope', Helvetica, Arial, sans-serif",
  fontSize: '13px',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  color: '#1f4634',
  margin: '0 0 20px',
}
