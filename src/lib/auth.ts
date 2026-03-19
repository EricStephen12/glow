import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev'

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
}

export function signToken(payload: any) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (e) {
        return null
    }
}
