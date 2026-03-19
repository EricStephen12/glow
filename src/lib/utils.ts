import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string): string {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    }).format(Number(amount))
}

export function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

export function formatDateTime(date: Date | string): string {
    return new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function formatTime(date: Date | string): string {
    return new Date(date).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function generateInvoiceNumber(): string {
    const prefix = 'GDC'
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
    return `${prefix}-${timestamp}-${random}`
}

export function calculateAge(dob: Date | string): number {
    const birth = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
}

export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

export function getStatusColor(status: string): string {
    const map: Record<string, string> = {
        PENDING: 'bg-amber-100 text-amber-800',
        CONFIRMED: 'bg-blue-100 text-blue-800',
        COMPLETED: 'bg-green-100 text-green-800',
        NO_SHOW: 'bg-red-100 text-red-800',
        CANCELLED: 'bg-gray-100 text-gray-800',
        RESCHEDULED: 'bg-purple-100 text-purple-800',
        UNPAID: 'bg-red-100 text-red-800',
        PART_PAID: 'bg-amber-100 text-amber-800',
        PAID: 'bg-green-100 text-green-800',
        ACTIVE: 'bg-blue-100 text-blue-800',
        IN_PROGRESS: 'bg-purple-100 text-purple-800',
    }
    return map[status] ?? 'bg-gray-100 text-gray-800'
}

export const TOOTH_CONDITIONS = [
    { value: 'healthy', label: 'Healthy', color: '#22c55e' },
    { value: 'cavity', label: 'Cavity', color: '#ef4444' },
    { value: 'filling', label: 'Filling', color: '#3b82f6' },
    { value: 'crown', label: 'Crown', color: '#f59e0b' },
    { value: 'missing', label: 'Missing', color: '#6b7280' },
    { value: 'implant', label: 'Implant', color: '#8b5cf6' },
    { value: 'root_canal', label: 'Root Canal', color: '#f97316' },
    { value: 'bridge', label: 'Bridge', color: '#06b6d4' },
    { value: 'veneer', label: 'Veneer', color: '#ec4899' },
    { value: 'extraction', label: 'Extraction', color: '#dc2626' },
] as const

export type ToothCondition = (typeof TOOTH_CONDITIONS)[number]['value']
