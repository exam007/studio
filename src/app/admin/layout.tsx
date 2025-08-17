
"use client"
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut, FileUp, Users, Eye, UserCheck, Loader2 } from "lucide-react";
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

type PendingRequest = {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading } = useAuth();

    const [pendingCount, setPendingCount] = useState(0);
    
    // This is a mock check for admin rights. In a real app, you'd have a more robust system.
    const isAdmin = user && user.email === 'narongtorn.s@attorney285.co.th';
    
    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            // Redirect non-admins or logged-out users to the home page
            router.push('/');
        }
    }, [user, loading, isAdmin, router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/');
    };


    const isActive = (path: string, tab?: string) => {
        const currentTab = searchParams.get('tab');
        if (path === '/admin/dashboard') {
            if (tab) {
                 return currentTab === tab;
            }
            // Default to 'exams' if no tab is selected
            return !currentTab || currentTab === 'exams';
        }
        return pathname.startsWith(path) && !tab;
    };

     useEffect(() => {
        const checkPendingRequests = () => {
            if (typeof window === 'undefined') return;
            const storedRequests = localStorage.getItem("pending_requests");
            if (storedRequests) {
                const requests: PendingRequest[] = JSON.parse(storedRequests);
                setPendingCount(requests.length);
            } else {
                setPendingCount(0);
            }
        };

        checkPendingRequests();
        
        // Listen for changes in localStorage from other tabs/windows
        window.addEventListener('storage', checkPendingRequests);

        return () => {
            window.removeEventListener('storage', checkPendingRequests);
        };
    }, []);

    if (loading || !user || !isAdmin) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">กำลังตรวจสอบสิทธิ์ผู้ดูแล...</p>
                </div>
            </div>
        )
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <Sidebar variant="inset" side="left">
                    <SidebarHeader>
                        <div className="flex items-center gap-2 p-2 justify-center">
                           <LayoutDashboard className="w-8 h-8 text-sidebar-primary"/>
                           <h2 className="text-2xl font-headline font-semibold text-sidebar-primary group-data-[collapsible=icon]:hidden">Admin</h2>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Link href="/admin/dashboard?tab=exams" passHref>
                                    <SidebarMenuButton tooltip="Dashboard" size="lg" isActive={isActive('/admin/dashboard', 'exams')}>
                                        <FileUp />
                                        <span>จัดการข้อสอบ</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                                <Link href="/admin/dashboard?tab=users" passHref>
                                    <SidebarMenuButton tooltip="จัดการผู้ใช้" size="lg" isActive={isActive('/admin/dashboard', 'users')}>
                                        <Users />
                                        <span>จัดการผู้ใช้</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <Link href="/admin/dashboard?tab=requests" passHref>
                                    <SidebarMenuButton tooltip="คำขออนุมัติ" size="lg" isActive={isActive('/admin/dashboard', 'requests')}>
                                        <div className="relative">
                                            <UserCheck />
                                            {pendingCount > 0 && (
                                                <Badge className="absolute -right-2 -top-1 h-5 w-5 justify-center p-0">{pendingCount}</Badge>
                                            )}
                                        </div>
                                        <span>คำขออนุมัติ</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                                <Link href="/dashboard" passHref>
                                    <SidebarMenuButton tooltip="มุมมองผู้ใช้" size="lg" isActive={pathname === '/dashboard'}>
                                        <Eye />
                                        <span>มุมมองผู้ใช้</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip="Logout" size="lg" onClick={handleLogout}>
                                    <LogOut />
                                    <span>Logout</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>
                <SidebarInset>
                    <header className="flex items-center justify-between p-4 border-b">
                        <SidebarTrigger />
                        <div className="flex items-center gap-4">
                            <span className="font-medium text-sm hidden sm:inline">Welcome, Admin!</span>
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="https://placehold.co/40x40" alt="Admin avatar" data-ai-hint="admin avatar" />
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                        </div>
                    </header>
                    <main className="p-4 sm:p-6 lg:p-8 flex-1">
                        {children}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
