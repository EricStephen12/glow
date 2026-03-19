import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-surface font-sans selection:bg-lavender/20">
            <AdminSidebar />
            <main className="flex-1 ml-72 min-h-screen overflow-auto">
                <div className="min-h-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
