import * as React from 'react'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brandMark}>UrjaSetu</Text>
        <Heading style={h1}>Confirm reauthentication</Heading>
        <Text style={text}>Use the code below to confirm your identity:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          This code will expire shortly. If you didn't request this, you can
          safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

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
const codeStyle = {
  fontFamily: "'Manrope', Helvetica, Arial, sans-serif",
  fontSize: '30px',
  letterSpacing: '6px',
  color: '#1f4634',
  backgroundColor: '#f7f4ec',
  border: '1px solid #e6dcc7',
  padding: '16px 20px',
  textAlign: 'center' as const,
  margin: '0 0 20px',
}
