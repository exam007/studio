
"use client"
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, LogOut, BookOpen, User, LayoutDashboard, Loader2 } from "lucide-react";
import Link from 'next/link';
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, loading, isRegisteredUser } = useAuth();
    
    useEffect(() => {
        if (!loading && (!user || !isRegisteredUser)) {
            router.push('/');
        }
    }, [user, loading, isRegisteredUser, router]);

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

    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <Sidebar variant="inset" side="left">
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
                                    <SidebarMenuButton tooltip="หน้าหลัก" size="lg" isActive>
                                        <Home />
                                        <span>หน้าหลัก</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                                <Link href="/admin/dashboard" passHref>
                                    <SidebarMenuButton tooltip="กลับหน้า Admin" size="lg">
                                        <LayoutDashboard />
                                        <span>กลับหน้า Admin</span>
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
                            <span className="font-medium text-sm hidden sm:inline">Welcome, {user?.displayName || 'User'}!</span>
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={user?.photoURL || "https://placehold.co/40x40"} alt="User avatar" data-ai-hint="user avatar" />
                                <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
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
