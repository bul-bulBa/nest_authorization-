import * as React from 'react'
import { Html } from '@react-email/html'
import { Body, Heading, Text, Link, Tailwind } from '@react-email/components'

interface twoFATemplateProps {
    code: string
}

export function TwoFactorAuthTemplate({ code }: twoFATemplateProps) {
    return (
        <Tailwind>
            <Html>
                <Body>
                    <Heading>Two factor authentification</Heading>
                    <Text>
                        Hello! Your two factor authentification code:<strong>{code}</strong>
                    </Text>
                    <Text>
                        Enter this code in application for continue authentification process
                    </Text>
                    <Text>
                        If you wasn't request this code, just ignore this message
                    </Text>
                </Body>
            </Html>
        </ Tailwind>
    )
}