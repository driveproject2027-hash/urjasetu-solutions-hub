import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

export interface JoinUsStatusProps {
  organisation?: string
  contactPerson?: string
  pathLabel?: string
  statusLabel?: string
  statusMessage?: string
  adminNote?: string
}

const forest = '#1f4634'
const ink = '#16233a'
const ivory = '#f7f4ec'
const sand = '#e6dcc7'

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'DM Sans', Helvetica, Arial, sans-serif",
  color: ink,
}
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 28px' }
const brand = {
  fontFamily: "'Manrope', Helvetica, Arial, sans-serif",
  fontSize: '13px',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  color: forest,
  margin: '0 0 20px',
}
const heading = {
  fontFamily: "'Manrope', Helvetica, Arial, sans-serif",
  fontSize: '24px',
  lineHeight: '1.25',
  color: ink,
  margin: '0 0 14px',
}
const paragraph = { fontSize: '15px', lineHeight: '1.6', color: ink, margin: '0 0 14px' }
const meta = { fontSize: '13px', lineHeight: '1.6', color: '#5b6472', margin: '0 0 6px' }
const statusBox = {
  backgroundColor: ivory,
  border: `1px solid ${sand}`,
  padding: '16px 18px',
  margin: '18px 0',
}
const statusText = {
  fontFamily: "'Manrope', Helvetica, Arial, sans-serif",
  fontSize: '17px',
  color: forest,
  margin: '0',
}
const noteLabel = {
  fontSize: '11px',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  color: '#5b6472',
  margin: '0 0 6px',
}
const hr = { borderColor: sand, margin: '26px 0 16px' }
const footer = { fontSize: '12px', lineHeight: '1.6', color: '#5b6472', margin: '0 0 6px' }

const Email = ({
  organisation,
  contactPerson,
  pathLabel,
  statusLabel,
  statusMessage,
  adminNote,
}: JoinUsStatusProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`Your UrjaSethu registration is now ${statusLabel ?? 'updated'}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>UrjaSethu</Text>
        <Heading style={heading}>Your registration has been reviewed</Heading>
        <Text style={paragraph}>
          {contactPerson ? `Dear ${contactPerson},` : 'Hello,'}
        </Text>
        <Text style={paragraph}>
          Thank you for registering{organisation ? ` ${organisation}` : ''} on UrjaSethu
          {pathLabel ? ` as a ${pathLabel}` : ''}. Our team has updated the status of your
          application.
        </Text>

        <Section style={statusBox}>
          <Text style={statusText}>Review status: {statusLabel ?? 'Updated'}</Text>
          {statusMessage ? <Text style={{ ...meta, margin: '8px 0 0' }}>{statusMessage}</Text> : null}
        </Section>

        {adminNote ? (
          <Section style={{ ...statusBox, backgroundColor: '#ffffff' }}>
            <Text style={noteLabel}>Note from the review team</Text>
            <Text style={{ ...paragraph, margin: '0' }}>{adminNote}</Text>
          </Section>
        ) : null}

        <Text style={paragraph}>
          You can view the platform and your listing details at{' '}
          <Link href="https://urjasethu.dev" style={{ color: forest }}>
            urjasethu.dev
          </Link>
          . If anything looks incorrect, simply reply to this email and we will get back to you.
        </Text>

        <Hr style={hr} />
        <Text style={footer}>UrjaSethu — Decentralised Renewable Energy marketplace for Indian MSMEs.</Text>
        <Text style={footer}>Supported by the DRIVE initiative.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, unknown>) =>
    `UrjaSethu registration update: ${String(data['statusLabel'] ?? 'reviewed')}`,
  displayName: 'Join Us review status update',
  previewData: {
    organisation: 'Surya Agro Solutions',
    contactPerson: 'Meera Nair',
    pathLabel: 'DRE Solution Provider',
    statusLabel: 'Approved',
    statusMessage:
      'Your organisation is now listed in the public provider directory and can receive customer enquiries.',
    adminNote: 'Please share your updated installation certificate within 30 days.',
  },
} satisfies TemplateEntry
