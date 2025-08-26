
"use client"
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, LogOut, BookOpen, User, LayoutDashboard, Loader2, Eye } from "lucide-react";
import Link from 'next/link';
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const isUserRegistered = (email: string | null): boolean => {
    if (typeof window === 'undefined' || !email) return false;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("user_")) {
            const item = localStorage.getItem(key);
            if(item){
                try {
                    const storedUser = JSON.parse(item);
                    if (storedUser.email && storedUser.email.toLowerCase() === email.toLowerCase()) {
                        return true;
                    }
                } catch(e) {
                    console.error("Failed to parse user from localStorage", e);
                }
            }
        }
    }
    return false;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading } = useAuth();
    const isAdmin = user && user.email === 'narongtorn.s@attorney285.co.th';
    
    useEffect(() => {
        if (!loading) {
            // If no user is logged in, redirect to login page.
            if (!user) {
                router.push('/');
                return;
            }
            // If the user is not an admin, check if they are a registered user.
            // If not registered, redirect them.
            if (!isAdmin && !isUserRegistered(user.email)) {
                 router.push('/');
            }
        }
    }, [user, loading, router, isAdmin]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/');
    };

    if (loading || !user) {
         return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">กำลังโหลดข้อมูลผู้ใช้...</p>
                </div>
            </div>
        )
    }

    const isActive = (path: string) => {
        return pathname === path;
    };

    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <Sidebar variant="sidebar" side="left" collapsible="icon">
                    <SidebarHeader>
                        <div className="flex items-center gap-2 p-2 justify-center">
                           <BookOpen className="w-8 h-8 text-sidebar-primary"/>
                           <h2 className="text-2xl font-headline font-semibold text-sidebar-primary group-data-[collapsible=icon]:hidden">แนวข้อสอบ</h2>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Link href="/dashboard" passHref>
                                    <SidebarMenuButton tooltip="หน้าหลัก" size="lg" isActive={isActive("/dashboard")}>
                                        <Home />
                                        <span>หน้าหลัก</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                             {isAdmin && (
                                <SidebarMenuItem>
                                    <Link href="/admin/dashboard" passHref>
                                        <SidebarMenuButton tooltip="กลับไปหน้า Admin" size="lg" isActive={isActive("/admin/dashboard")}>
                                            <LayoutDashboard />
                                            <span>กลับไปหน้า Admin</span>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            )}
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
                <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8">
                    <main className="flex-1 bg-card rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
                         <header className="flex items-center justify-between mb-8">
                            <SidebarTrigger />
                            <div className="flex items-center gap-4">
                                <span className="font-medium text-sm hidden sm:inline">Welcome, {user?.displayName || 'User'}!</span>
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={user?.photoURL || "https://placehold.co/40x40"} alt="User avatar" data-ai-hint="user avatar"/>
                                    <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                            </div>
                        </header>
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
