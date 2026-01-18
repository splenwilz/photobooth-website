'use server'

import { signin } from '../signin/services'
import type { EmailVerificationResponse } from '../signin/types'
import type { AuthResponse } from '../types'
import { signup } from './services'
import type { SignupRequest } from './types'

/**
 * Server action result type for signup
 */
export type SignupActionResult =
    | {
        success: true
        data: {
            signupResponse: AuthResponse
            signinResponse?: AuthResponse | EmailVerificationResponse
            email: string
        }
    }
    | { success: false; error: string }

/**
 * Server action for user signup
 * 
 * Handles:
 * 1. User registration
 * 2. Automatic signin after signup (to get verification token if needed)
 * 
 * @param prevState - Previous action state (for useActionState)
 * @param formData - Form data containing user signup information
 * @returns Promise resolving to signup result
 */
export async function signupAction(
    prevState: SignupActionResult | null,
    formData: FormData
): Promise<SignupActionResult> {
    try {
        // Extract and validate form data
        const firstName = formData.get('firstName')?.toString()
        const lastName = formData.get('lastName')?.toString()
        const email = formData.get('email')?.toString()
        const password = formData.get('password')?.toString()
        const confirmPassword = formData.get('confirmPassword')?.toString()

        // Validation
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return {
                success: false,
                error: 'All fields are required',
            }
        }

        if (firstName.length < 2 || firstName.length > 50) {
            return {
                success: false,
                error: 'First name must be between 2 and 50 characters',
            }
        }

        if (lastName.length < 2 || lastName.length > 50) {
            return {
                success: false,
                error: 'Last name must be between 2 and 50 characters',
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return {
                success: false,
                error: 'Invalid email address',
            }
        }

        if (password.length < 8) {
            return {
                success: false,
                error: 'Password must be at least 8 characters',
            }
        }
        if (password.length > 50) {
            return {
                success: false,
                error: 'Password must be less than 50 characters',
            }
        }

        if (password !== confirmPassword) {
            return {
                success: false,
                error: 'Passwords do not match',
            }
        }

        // Transform to snake_case for API
        const requestBody: SignupRequest = {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            confirm_password: confirmPassword,
        }

        // Step 1: Sign up the user
        const signupResponse = await signup(requestBody)

        // Step 2: Automatically sign in to get verification token if needed
        let signinResponse: AuthResponse | EmailVerificationResponse | undefined
        try {
            signinResponse = await signin({
                email,
                password,
            })
        } catch (signinErr) {
            // If signin fails, that's okay - user can sign in manually
            console.log('Auto signin after signup failed (user can sign in manually):', signinErr)
        }

        return {
            success: true,
            data: {
                signupResponse,
                signinResponse,
                email,
            },
        }
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Failed to create account. Please try again.'

        return {
            success: false,
            error: errorMessage,
        }
    }
}