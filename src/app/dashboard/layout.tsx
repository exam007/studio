
"use client"
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, LogOut, BookOpen, LayoutDashboard, Loader2 } from "lucide-react";
import Link from 'next/link';
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ref, get } from "firebase/database";

const isUserRegistered = async (uid: string): Promise<boolean> => {
    if (!uid) return false;
    try {
        const userRef = ref(db, `users/${uid}`);
        const snapshot = await get(userRef);
        return snapshot.exists();
    } catch (error) {
        console.error("Error checking registration:", error);
        return false;
    }
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isChecking, setIsChecking] = useState(true); // Manages loading screen

    useEffect(() => {
        const checkAuthorization = async () => {
            if (loading) {
                return; 
            }

            if (!user) {
                router.push('/login');
                return;
            }
            
            const adminStatus = user.email === 'narongtorn.s@attorney285.co.th';
            setIsAdmin(adminStatus);
            
            let authorized = false;
            if (adminStatus) {
                authorized = true;
            } else {
                const registered = await isUserRegistered(user.uid);
                if (registered) {
                    authorized = true;
                } else {
                    await signOut(auth);
                    router.push('/login');
                    return;
                }
            }
            
            if(authorized){
                setIsChecking(false);
            }
        };

        checkAuthorization();
    }, [user, loading, router]);


    const handleLogout = async () => {
        await signOut(auth);
        sessionStorage.removeItem('isAdminLoggedIn'); // Also clear admin session
        router.push('/login');
    };

    const handleSwitchToAdminView = async () => {
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        router.push('/admin/dashboard');
    }

    if (isChecking) {
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
            <div className="flex min-h-screen w-full">
                <Sidebar variant="sidebar" side="left" collapsible="icon" className="bg-sidebar text-sidebar-foreground">
                    <SidebarHeader>
                        <div className="flex items-center gap-2 p-4 justify-center">
                           <BookOpen className="w-6 h-6 text-sidebar-primary"/>
                           <h2 className="text-2xl font-headline font-semibold text-sidebar-primary group-data-[collapsible=icon]:hidden">แนวข้อสอบ</h2>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Link href="/dashboard" passHref>
                                    <SidebarMenuButton tooltip="หน้าหลัก" size="lg" isActive={isActive("/dashboard")} className="group-data-[collapsible=icon]:justify-center">
                                        <Home />
                                        <span className="group-data-[collapsible=icon]:hidden">หน้าหลัก</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                             {isAdmin && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={handleSwitchToAdminView} tooltip="กลับไปหน้า Admin" size="lg" className="group-data-[collapsible=icon]:justify-center">
                                        <LayoutDashboard />
                                        <span className="group-data-[collapsible=icon]:hidden">กลับไปหน้า Admin</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
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
                            <span className="font-medium text-sm hidden sm:inline">Welcome, {user?.displayName || 'User'}!</span>
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={user?.photoURL || "https://placehold.co/40x40"} alt="User avatar" data-ai-hint="user avatar"/>
                                <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
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
