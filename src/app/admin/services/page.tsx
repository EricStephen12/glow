'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
    Plus, Search, Edit2, Trash2,
    ToggleLeft, ToggleRight, Clock, Tag, X
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function AdminServicesPage() {
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingService, setEditingService] = useState<any>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
        category: 'General'
    })

    useEffect(() => {
        fetchServices()
    }, [])

    async function fetchServices() {
        try {
            const res = await fetch('/api/services')
            const data = await res.json()
            setServices(data.services || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const openModal = (service: any = null) => {
        if (service) {
            setEditingService(service)
            setFormData({
                name: service.name,
                description: service.description || '',
                price: service.price.toString(),
                duration: service.duration.toString(),
                category: service.category || 'General'
            })
        } else {
            setEditingService(null)
            setFormData({
                name: '',
                description: '',
                price: '',
                duration: '',
                category: 'General'
            })
        }
        setIsModalOpen(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        const method = editingService ? 'PATCH' : 'POST'
        const url = editingService ? `/api/services/${editingService.id}` : '/api/services'

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    duration: parseInt(formData.duration)
                })
            })
            if (res.ok) {
                setIsModalOpen(false)
                fetchServices()
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return
        try {
            const res = await fetch(`/api/services/${id}`, { method: 'DELETE' })
            if (res.ok) fetchServices()
        } catch (e) {
            console.error(e)
        }
    }

    const handleToggleActive = async (service: any) => {
        try {
            const res = await fetch(`/api/services/${service.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !service.isActive })
            })
            if (res.ok) fetchServices()
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="p-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-dark font-display">Service Catalog</h1>
                    <p className="text-gray-500">Manage your clinic's offerings, pricing and durations.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="btn-primary"
                >
                    <Plus className="w-4 h-4" /> Add New Service
                </button>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-gray-400">Loading catalog...</div>
                ) : (
                    services.map((service, i) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="card p-6 flex flex-col group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-navy/5 text-navy flex items-center justify-center text-xl shadow-inner">
                                    {service.category === 'Cosmetic' ? '✨' : '🦷'}
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => openModal(service)}
                                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-navy transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-dark font-display mb-1">{service.name}</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">{service.category}</p>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-6 h-10">{service.description}</p>

                            <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                        <Clock className="w-3.5 h-3.5" /> {service.duration} mins
                                    </div>
                                    <div className="flex items-center gap-1.5 text-navy font-bold text-lg">
                                        {formatCurrency(service.price)}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`badge ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'}`}>
                                        {service.isActive ? 'Active' : 'Hidden'}
                                    </span>
                                    <button
                                        onClick={() => handleToggleActive(service)}
                                        className="text-gray-300 hover:text-navy transition-colors"
                                    >
                                        {service.isActive ? <ToggleRight className="w-6 h-6 text-mint-dark" /> : <ToggleLeft className="w-6 h-6" />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {services.length === 0 && !loading && (
                <div className="card p-20 text-center border-dashed border-2">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Tag className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-bold font-display">No services added yet</p>
                    <p className="text-sm text-gray-400 mt-1 mb-6">Start by adding your first dental procedure.</p>
                    <button onClick={() => openModal()} className="btn-primary inline-flex">Add Your First Service</button>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-dark font-display">
                                    {editingService ? 'Edit Service' : 'Add New Service'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div>
                                    <label className="form-label">Service Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="form-input"
                                        placeholder="e.g. Teeth Whitening"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-input"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>General</option>
                                        <option>Cosmetic</option>
                                        <option>Surgical</option>
                                        <option>Orthodontic</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="form-label">Price (₦)</label>
                                        <input
                                            type="number"
                                            required
                                            className="form-input"
                                            placeholder="50000"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Duration (mins)</label>
                                        <input
                                            type="number"
                                            required
                                            className="form-input"
                                            placeholder="45"
                                            value={formData.duration}
                                            onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-input"
                                        rows={3}
                                        placeholder="Brief description of the service..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-2 btn-primary justify-center py-3"
                                    >
                                        {editingService ? 'Save Changes' : 'Create Service'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
