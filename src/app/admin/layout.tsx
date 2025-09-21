
"use client"
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut, FileUp, Users, Eye, UserCheck, Loader2 } from "lucide-react";
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ref, onValue } from "firebase/database";
import { useToast } from "@/components/ui/use-toast";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const { user, loading } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);

    const [pendingCount, setPendingCount] = useState(0);
    
    useEffect(() => {
        if (loading) return;

        const isAdminSession = sessionStorage.getItem('isAdminLoggedIn') === 'true';
        
        // If there is an admin session, they are authorized.
        // We also check for the firebase user to cover cases where they switched from user view.
        if (isAdminSession || (user && user.email === 'narongtorn.s@attorney285.co.th')) {
            setIsAuthorized(true);
        } else {
             // Otherwise, if not loading and no user/session, redirect
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const requestsRef = ref(db, 'requests/');
        const unsubscribe = onValue(requestsRef, (snapshot) => {
            const pendingRequests = snapshot.val() || {};
            setPendingCount(Object.keys(pendingRequests).length);
        });
        
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        sessionStorage.removeItem('isAdminLoggedIn');
        router.push('/login');
    };

    const handleViewAsUser = () => {
        // The admin is already logged in, so we can just navigate to the user dashboard.
        // The dashboard layout will correctly interpret the admin's session.
        router.push('/dashboard?tab=all-quizzes');
    };

    const isActive = (path: string, tab?: string) => {
        const currentTab = searchParams.get('tab');
        if (path === '/admin/dashboard') {
            if (tab) {
                return currentTab === tab;
            }
            // Default to 'exams' tab if no tab is selected
            return pathname === path && (currentTab === 'exams' || !currentTab);
        }
        return pathname.startsWith(path) && !tab;
    };


    if (loading || !isAuthorized) {
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
                                <SidebarMenuButton onClick={handleViewAsUser} tooltip="มุมมองผู้ใช้" size="lg" className="group-data-[collapsible=icon]:justify-center">
                                    <Eye />
                                    <span className="group-data-[collapsible=icon]:hidden">มุมมองผู้ใช้</span>
                                </SidebarMenuButton>
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
