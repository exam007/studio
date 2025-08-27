
import { Suspense } from "react";
import { DashboardContent } from "@/components/admin/DashboardContent";
import { Loader2 } from "lucide-react";
import { redirect } from 'next/navigation'

// This tells Next.js to render this page dynamically, which is better for pages
// that rely on search params or user-specific data.
export const dynamic = 'force-dynamic';

export default function AdminDashboardPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const tab = searchParams['tab'];

    if (!tab) {
        redirect('/admin/dashboard?tab=exams');
    }

    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen w-full"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <DashboardContent />
        </Suspense>
    );
};
