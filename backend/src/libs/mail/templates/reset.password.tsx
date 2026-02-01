import * as React from 'react'
import { Html } from '@react-email/html'
import { Body, Heading, Text, Link, Tailwind } from '@react-email/components'

interface ResetTemplateProps {
    domain: string,
    token: string
}

export function ResetPasswordTemplate(
    { domain, token }: ResetTemplateProps
) {
    const resetLink = `${domain}/auth/new-password?token=${token}`

    return (
        <Tailwind>
            <Html>
                <Body>
                    <Heading>Reset password</Heading>
                    <Text>
                        Hello! To reset your password,
                        please follow this link:
                    </Text>
                    <Link href={resetLink}>Reset password</Link>
                    <Text>
                        This link is valid for 1 hour. If you was't request password reset,
                        just ignore this message
                    </Text>
                </Body>
            </Html>
        </ Tailwind>
    )
}