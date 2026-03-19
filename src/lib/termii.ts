export async function sendSMS(to: string, message: string) {
    const apiKey = process.env.TERMII_API_KEY
    const senderId = process.env.TERMII_SENDER_ID || 'GlowDental'

    if (!apiKey) {
        console.warn('[TERMII] API Key missing. Simulating SMS.')
        console.log(`[SIMULATED SMS] To: ${to}, Message: ${message}`)
        return { success: true, simulated: true }
    }

    try {
        // Ensure phone number is in correct format (remove leading 0 and add 234 if needed)
        let formattedPhone = to.replace(/\s+/g, '')
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '234' + formattedPhone.substring(1)
        } else if (!formattedPhone.startsWith('234') && formattedPhone.length === 10) {
            formattedPhone = '234' + formattedPhone
        }

        const res = await fetch('https://api.ng.termii.com/api/sms/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                api_key: apiKey,
                to: formattedPhone,
                from: senderId,
                sms: message,
                type: 'plain',
                channel: 'dnd', // Using DND channel for better delivery in Nigeria
            }),
        })

        const data = await res.json()

        if (!res.ok) {
            console.error('[TERMII] Error sending SMS:', data)
            return { success: false, error: data }
        }

        console.log(`[TERMII] SMS sent successfully to ${formattedPhone}`)
        return { success: true, data }
    } catch (error) {
        console.error('[TERMII] Exception sending SMS:', error)
        return { success: false, error }
    }
}
