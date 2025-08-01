
"use client"
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut, FileUp, Shield, Users } from "lucide-react";
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
                                <Link href="/admin/dashboard" passHref>
                                    <SidebarMenuButton tooltip="Dashboard" size="lg">
                                        <LayoutDashboard />
                                        <span>Dashboard</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                                <SidebarMenuButton tooltip="จัดการข้อสอบ" size="lg">
                                    <FileUp />
                                    <span>จัดการข้อสอบ</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                                <SidebarMenuButton tooltip="จัดการสิทธิ์" size="lg">
                                    <Shield />
                                    <span>จัดการสิทธิ์</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                                <SidebarMenuButton tooltip="จัดการผู้ใช้" size="lg">
                                    <Users />
                                    <span>จัดการผู้ใช้</span>
                                </SidebarMenuButton>
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

