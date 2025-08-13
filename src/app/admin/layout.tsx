
"use client"
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut, FileUp, Users, Eye, ShieldCheck } from "lucide-react";
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
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
                                <Link href="/" passHref>
                                    <SidebarMenuButton tooltip="Logout" size="lg">
                                        <LogOut />
                                        <span>Logout</span>
                                    </SidebarMenuButton>
                                </Link>
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
