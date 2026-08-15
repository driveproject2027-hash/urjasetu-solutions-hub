import * as React from 'react'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brandMark}>UrjaSetu</Text>
        <Heading style={h1}>Confirm your email</Heading>
        <Text style={text}>
          Thanks for signing up for{' '}
          <Link href={siteUrl} style={link}>
            <strong>{siteName}</strong>
          </Link>
          !
        </Text>
        <Text style={text}>
          Please confirm your email address (
          <Link href={`mailto:${recipient}`} style={link}>
            {recipient}
          </Link>
          ) by clicking the button below:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Verify Email
        </Button>
        <Text style={footer}>
          If you didn't create an account, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

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
