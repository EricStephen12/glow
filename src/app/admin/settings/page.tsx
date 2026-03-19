'use client'
import { motion } from 'framer-motion'
import {
    Settings, Building2, User, Bell,
    ShieldCheck, Smartphone, Mail, Globe,
    CheckCircle2
} from 'lucide-react'
import { useState } from 'react'

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('general')
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setTimeout(() => {
            setSaving(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        }, 1000)
    }

    const TABS = [
        { id: 'general', label: 'Clinic Profile', icon: Building2 },
        { id: 'security', label: 'Security & Access', icon: ShieldCheck },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'integrations', label: 'System Integrations', icon: Globe },
    ]

    return (
        <div className="p-8 pb-24">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-dark font-display">Clinic Settings</h1>
                    <p className="text-gray-500">Manage Glow Dental's operational parameters and system preferences.</p>
                </div>
                {saved && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold"
                    >
                        <CheckCircle2 className="w-4 h-4" /> Preferences Saved
                    </motion.div>
                )}
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:w-64 flex-shrink-0 space-y-2">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                activeTab === tab.id
                                    ? 'bg-navy text-white shadow-lg'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-navy'
                            }`}
                        >
                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-lavender' : 'text-gray-400'}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card p-8"
                    >
                        {activeTab === 'general' && (
                            <form onSubmit={handleSave} className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold text-navy font-display mb-6">Clinic Information</h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="form-label">Clinic Name</label>
                                            <input type="text" className="form-input" defaultValue="Glow Dental Clinic" />
                                        </div>
                                        <div>
                                            <label className="form-label">Registration Number</label>
                                            <input type="text" className="form-input" defaultValue="MDCN-123456" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="form-label">Primary Address</label>
                                            <input type="text" className="form-input" defaultValue="Victoria Island, Lagos, Nigeria" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-100">
                                    <h2 className="text-xl font-bold text-navy font-display mb-6">Contact Details</h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="form-label">Official Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input type="email" className="form-input pl-11" defaultValue="hello@glowdental.ng" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="form-label">Support Phone</label>
                                            <div className="relative">
                                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input type="tel" className="form-input pl-11" defaultValue="+234 800 GLOW DEN" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 flex justify-end">
                                    <button type="submit" disabled={saving} className="btn-primary min-w-[150px] justify-center">
                                        {saving ? 'Saving...' : 'Save Configuration'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-8">
                                <h2 className="text-xl font-bold text-navy font-display mb-2">Security & Access Control</h2>
                                <p className="text-sm text-gray-500 mb-6">Manage administrator roles and security policies for the clinic.</p>
                                
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-dark text-sm">Two-Factor Authentication (2FA)</h4>
                                        <p className="text-xs text-gray-500 mt-1">Require staff to use an authenticator app when signing in.</p>
                                    </div>
                                    <button className="px-4 py-2 bg-navy text-white text-xs font-bold rounded-lg uppercase tracking-wider">Enable 2FA</button>
                                </div>

                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-dark text-sm">Audit Logs</h4>
                                        <p className="text-xs text-gray-500 mt-1">Review all actions performed by administrative staff.</p>
                                    </div>
                                    <button className="px-4 py-2 border border-gray-200 text-gray-600 bg-white text-xs font-bold rounded-lg uppercase tracking-wider hover:bg-gray-50">View Logs</button>
                                </div>
                            </div>
                        )}

                        {/* Stubs for other tabs just to show it's built */}
                        {activeTab === 'notifications' && (
                            <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-sm">
                                Notification preferences coming soon
                            </div>
                        )}
                        {activeTab === 'integrations' && (
                            <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-sm">
                                Integration marketplace coming soon
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
