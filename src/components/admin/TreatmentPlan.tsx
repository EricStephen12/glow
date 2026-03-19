'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
    Plus, CheckCircle2, Clock, Trash2,
    ChevronDown, ChevronUp, AlertCircle, Sparkles,
    ArrowRight
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

const STATUS_MAP = {
    PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-800' },
    IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-800' },
    CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-400' },
}

export default function TreatmentPlan({ plans = [] }: { plans?: any[] }) {
    const [activePlanId, setActivePlanId] = useState<string | null>(plans[0]?.id || null)
    const [addingProcedure, setAddingProcedure] = useState(false)

    const activePlan = plans.find(p => p.id === activePlanId)

    return (
        <div className="space-y-6">
            {/* Plan Selector / Add Plan */}
            <div className="flex items-center justify-between">
                <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-gray-100 overflow-x-auto no-scrollbar max-w-full">
                    {plans.map((plan) => (
                        <button
                            key={plan.id}
                            onClick={() => setActivePlanId(plan.id)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activePlanId === plan.id
                                    ? 'bg-navy text-white shadow-md'
                                    : 'text-gray-400 hover:text-navy hover:bg-gray-50'
                                }`}
                        >
                            {plan.title}
                        </button>
                    ))}
                    <button className="px-4 py-2.5 rounded-xl text-gray-400 hover:text-navy hover:bg-navy/5 transition-all">
                        + New Plan
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activePlan ? (
                    <motion.div
                        key={activePlan.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card p-0 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-xl font-bold text-dark font-display">{activePlan.title}</h2>
                                    <span className="badge bg-navy/5 text-navy text-[9px] border border-navy/10">{activePlan.status}</span>
                                </div>
                                <p className="text-xs text-gray-400">Created on {formatDate(activePlan.createdAt)} • {activePlan.procedures.length} total procedures</p>
                            </div>
                            <button
                                onClick={() => setAddingProcedure(true)}
                                className="btn-primary text-xs py-2.5 px-4"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Procedure
                            </button>
                        </div>

                        {/* List */}
                        <div className="p-6">
                            <div className="space-y-4">
                                {activePlan.procedures.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Sparkles className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                                        <p className="text-sm text-gray-400 font-medium">No procedures added to this plan yet.</p>
                                    </div>
                                ) : (
                                    activePlan.procedures.map((proc: any, i: number) => (
                                        <motion.div
                                            key={proc.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group flex gap-5 p-4 bg-white border border-gray-100 rounded-2xl hover:border-navy/20 hover:shadow-sm transition-all"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${proc.status === 'COMPLETED' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200 text-gray-300'
                                                    }`}>
                                                    {proc.status === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                                                </div>
                                                {i < activePlan.procedures.length - 1 && (
                                                    <div className="w-0.5 flex-1 bg-gray-100 my-1" />
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold text-dark text-sm leading-tight mb-1">{proc.name}</p>
                                                        <p className="text-xs text-gray-500 max-w-md line-clamp-1">{proc.description}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {proc.toothNumbers && (
                                                            <span className="text-[10px] font-bold text-navy bg-navy/5 px-2 py-0.5 rounded-lg border border-navy/10">Teeth: {proc.toothNumbers}</span>
                                                        )}
                                                        <span className={`badge text-[9px] ${STATUS_MAP[proc.status as keyof typeof STATUS_MAP]?.color}`}>{proc.status}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
                                                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {proc.completedDate ? `Done ${formatDate(proc.completedDate)}` : 'Scheduled'}</span>
                                                        <span className="text-dark">{formatCurrency(proc.cost || 0)}</span>
                                                    </div>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-1 px-2.5 rounded-lg text-[9px] font-bold text-navy border border-navy/10 hover:bg-navy hover:text-white transition-all">Next Stage</button>
                                                        <button className="p-1 px-2 rounded-lg text-red-300 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="w-3 h-3" /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Footer / Summary */}
                        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Estimated Cost</p>
                                    <p className="text-lg font-bold text-dark">₦450,000</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Paid to date</p>
                                    <p className="text-lg font-bold text-green-600">₦120,500</p>
                                </div>
                            </div>
                            <button className="btn-secondary h-fit py-3 px-6 text-navy border-navy/20 hover:bg-white text-xs">
                                Invoiced Shared <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="card p-20 text-center">
                        <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-dark font-display">No Treatment Plan Found</h3>
                        <p className="text-sm text-gray-500 mt-2 mb-8">Start by creating a structured plan for the patient's oral care.</p>
                        <button className="btn-primary inline-flex">
                            Create First Plan
                        </button>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
