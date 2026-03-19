'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Clock, FileText, CheckCircle2 } from 'lucide-react'
import { TOOTH_CONDITIONS } from '@/lib/utils'

interface ToothProps {
    number: number
    condition?: string
    onClick: (number: number) => void
    selected?: boolean
}

function Tooth({ number, condition, onClick, selected }: ToothProps) {
    const conditionInfo = TOOTH_CONDITIONS.find(c => c.value === condition)

    return (
        <div
            onClick={() => onClick(number)}
            className={`relative group cursor-pointer flex flex-col items-center p-2 rounded-xl transition-all ${selected ? 'bg-navy/10 ring-2 ring-navy shadow-inner' : 'hover:bg-gray-50'
                }`}
        >
            <span className="text-[9px] font-bold text-gray-400 mb-1">{number}</span>
            <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M4 8C4 4 8 2 12 2C16 2 20 4 20 8C20 12 18 16 16 20C14 24 10 24 8 20C6 16 4 12 4 8Z"
                    fill={conditionInfo?.color || '#E2E8F0'}
                    stroke={selected ? '#6B1D2A' : '#CBD5E1'}
                    strokeWidth="1.5"
                />
                {condition === 'cavity' && <circle cx="12" cy="10" r="3" fill="#991b1b" />}
                {condition === 'filling' && <rect x="8" y="8" width="8" height="6" rx="1" fill="#1e40af" />}
            </svg>
            {conditionInfo && (
                <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: conditionInfo.color }} />
            )}
        </div>
    )
}

export default function DentalChart({
    initialData = [],
    patientId
}: {
    initialData?: any[],
    patientId: string
}) {
    const [selectedTooth, setSelectedTooth] = useState<number | null>(null)
    const [notes, setNotes] = useState('')
    const [saving, setSaving] = useState(false)
    const [conditions, setConditions] = useState<Record<number, string>>(
        initialData.reduce((acc, curr) => ({ ...acc, [curr.toothNumber]: curr.condition }), {})
    )

    const upperTeeth = Array.from({ length: 16 }, (_, i) => i + 1)
    const lowerTeeth = Array.from({ length: 16 }, (_, i) => 17 + i).reverse()

    const handleToothClick = (num: number) => {
        setSelectedTooth(num === selectedTooth ? null : num)
    }

    const updateCondition = (cond: string) => {
        if (selectedTooth) {
            setConditions(prev => ({ ...prev, [selectedTooth]: cond }))
        }
    }

    const handleUpdateTooth = async () => {
        if (!selectedTooth || !conditions[selectedTooth]) return

        setSaving(true)
        try {
            const res = await fetch(`/api/patients/${patientId}/dental-chart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    toothNumber: selectedTooth,
                    condition: conditions[selectedTooth],
                    note: notes
                })
            })
            if (res.ok) {
                // Success feedback? Clear notes?
                setNotes('')
                setSelectedTooth(null)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="card p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                {/* Chart View */}
                <div className="flex-1 w-full space-y-12">
                    {/* Upper Jaw */}
                    <div className="flex flex-wrap justify-between gap-1 items-end border-b border-gray-100 pb-8">
                        {upperTeeth.map(num => (
                            <Tooth
                                key={num}
                                number={num}
                                condition={conditions[num]}
                                selected={selectedTooth === num}
                                onClick={handleToothClick}
                            />
                        ))}
                    </div>

                    {/* Lower Jaw */}
                    <div className="flex flex-wrap justify-between gap-1 items-start">
                        {lowerTeeth.map(num => (
                            <Tooth
                                key={num}
                                number={num}
                                condition={conditions[num]}
                                selected={selectedTooth === num}
                                onClick={handleToothClick}
                            />
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-gray-100">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest w-full mb-2">Legend</div>
                        {TOOTH_CONDITIONS.map(c => (
                            <div key={c.value} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                                <span className="text-xs text-gray-600 font-medium">{c.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Panel */}
                <div className="w-full md:w-80 flex-shrink-0">
                    <AnimatePresence mode="wait">
                        {selectedTooth ? (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-dark font-display text-lg">Tooth #{selectedTooth}</h3>
                                    <button
                                        onClick={() => setSelectedTooth(null)}
                                        className="text-gray-400 hover:text-dark"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="form-label text-[10px]">Mark Condition</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {TOOTH_CONDITIONS.map(c => (
                                                <button
                                                    key={c.value}
                                                    onClick={() => updateCondition(c.value)}
                                                    className={`p-2 rounded-xl border text-[10px] font-bold transition-all text-center ${conditions[selectedTooth] === c.value
                                                        ? 'bg-navy text-white border-navy shadow-md'
                                                        : 'bg-white text-gray-600 border-gray-100 hover:border-navy'
                                                        }`}
                                                >
                                                    {c.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label text-[10px]">Notes</label>
                                        <textarea
                                            className="form-input text-xs"
                                            rows={3}
                                            placeholder="Add clinical observation..."
                                            value={notes}
                                            onChange={e => setNotes(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        onClick={handleUpdateTooth}
                                        disabled={saving || !conditions[selectedTooth]}
                                        className="btn-primary w-full text-xs py-3 justify-center disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Update Tooth Record'}
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-navy/5 rounded-2xl p-6 border border-dashed border-navy/20 flex flex-col items-center text-center"
                            >
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                                    <Plus className="w-6 h-6 text-navy" />
                                </div>
                                <p className="text-sm font-bold text-navy">Select a tooth</p>
                                <p className="text-xs text-gray-500 mt-1">Click on a tooth from the map to mark conditions or view history.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Recent Logs toggle */}
                    <div className="mt-6 space-y-3">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">Recent Changes</p>
                        {[
                            { tooth: 4, action: 'Marked Cavity', date: 'Oct 12, 2023' },
                            { tooth: 18, action: 'Filling Done', date: 'Aug 05, 2023' },
                        ].map((log, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 text-[11px]">
                                <Clock className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="font-bold text-dark">Tooth #{log.tooth}: {log.action}</p>
                                    <p className="text-gray-400 mt-0.5">{log.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
