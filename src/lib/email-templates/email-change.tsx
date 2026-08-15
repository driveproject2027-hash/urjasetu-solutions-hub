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

interface EmailChangeEmailProps {
  siteName: string
  // oldEmail is the user's current address (HookData.OldEmail). For the
  // NEW-recipient half of a secure email_change fanout, `email` equals the
  // recipient (NEW), so the "from" line must render oldEmail to read
  // "from OLD to NEW" instead of "from NEW to NEW".
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  oldEmail,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email change for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brandMark}>UrjaSethu</Text>
        <Heading style={h1}>Confirm your email change</Heading>
        <Text style={text}>
          You requested to change your email address for {siteName} from{' '}
          <Link href={`mailto:${oldEmail}`} style={link}>
            {oldEmail}
          </Link>{' '}
          to{' '}
          <Link href={`mailto:${newEmail}`} style={link}>
            {newEmail}
          </Link>
          .
        </Text>
        <Text style={text}>
          Click the button below to confirm this change:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirm Email Change
        </Button>
        <Text style={footer}>
          If you didn't request this change, please secure your account
          immediately.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

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
