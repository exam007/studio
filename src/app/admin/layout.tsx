
"use client"
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut, FileUp, Users, Eye, UserCheck, Loader2 } from "lucide-react";
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ref, onValue } from "firebase/database";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading } = useAuth();

    const [pendingCount, setPendingCount] = useState(0);
    
    useEffect(() => {
        if (!loading) {
            const isAdmin = user && user.email === 'narongtorn.s@attorney285.co.th';
            if (!user || !isAdmin) {
                router.push('/');
            }
        }
    }, [user, loading, router]);

    useEffect(() => {
        const requestsRef = ref(db, 'requests/');
        const unsubscribe = onValue(requestsRef, (snapshot) => {
            if (snapshot.exists()) {
                setPendingCount(Object.keys(snapshot.val()).length);
            } else {
                setPendingCount(0);
            }
        });
        
        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

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
            return !currentTab || currentTab === 'exams';
        }
        return pathname.startsWith(path) && !tab;
    };

    if (loading || !user) {
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
            <div className="flex min-h-screen w-full">
                <Sidebar variant="sidebar" side="left" collapsible="icon" className="bg-sidebar text-sidebar-foreground">
                    <SidebarHeader>
                        <div className="flex items-center gap-2 p-4 justify-center">
                           <LayoutDashboard className="w-6 h-6 text-sidebar-primary"/>
                           <h2 className="text-2xl font-headline font-semibold text-sidebar-primary group-data-[collapsible=icon]:hidden">Admin</h2>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Link href="/admin/dashboard?tab=exams" passHref>
                                    <SidebarMenuButton tooltip="Dashboard" size="lg" isActive={isActive('/admin/dashboard', 'exams')} className="group-data-[collapsible=icon]:justify-center">
                                        <FileUp />
                                        <span className="group-data-[collapsible=icon]:hidden">จัดการข้อสอบ</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                                <Link href="/admin/dashboard?tab=users" passHref>
                                    <SidebarMenuButton tooltip="จัดการผู้ใช้" size="lg" isActive={isActive('/admin/dashboard', 'users')} className="group-data-[collapsible=icon]:justify-center">
                                        <Users />
                                        <span className="group-data-[collapsible=icon]:hidden">จัดการผู้ใช้</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <Link href="/admin/dashboard?tab=requests" passHref>
                                    <SidebarMenuButton tooltip="คำขออนุมัติ" size="lg" isActive={isActive('/admin/dashboard', 'requests')} className="group-data-[collapsible=icon]:justify-center">
                                        <div className="relative">
                                            <UserCheck />
                                            {pendingCount > 0 && (
                                                <Badge className="absolute -right-2 -top-1 h-5 w-5 justify-center p-0 group-data-[collapsible=icon]:hidden">{pendingCount}</Badge>
                                            )}
                                        </div>
                                        <span className="group-data-[collapsible=icon]:hidden">คำขออนุมัติ</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                                <Link href="/dashboard" passHref>
                                    <SidebarMenuButton tooltip="มุมมองผู้ใช้" size="lg" isActive={pathname === '/dashboard'} className="group-data-[collapsible=icon]:justify-center">
                                        <Eye />
                                        <span className="group-data-[collapsible=icon]:hidden">มุมมองผู้ใช้</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip="Logout" size="lg" onClick={handleLogout} className="group-data-[collapsible=icon]:justify-center">
                                    <LogOut />
                                    <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>
                <div className="flex-1 flex flex-col">
                     <header className="flex h-14 items-center justify-between border-b bg-card px-4 sm:px-6">
                        <SidebarTrigger />
                        <div className="flex items-center gap-4">
                            <span className="font-medium text-sm hidden sm:inline">Welcome, Admin!</span>
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="https://placehold.co/40x40.png" alt="Admin avatar" data-ai-hint="admin avatar"/>
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                        </div>
                    </header>
                    <main className="flex-1 overflow-auto bg-muted/30 p-4 sm:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
