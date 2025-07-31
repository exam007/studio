
"use client"
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut, FileUp, Shield, Users } from "lucide-react";
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-background">
                <Sidebar>
                    <SidebarHeader>
                        <div className="flex items-center gap-2 p-2">
                           <LayoutDashboard className="w-8 h-8 text-primary"/>
                           <h2 className="text-2xl font-headline font-semibold text-primary">Admin</h2>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Link href="/admin/dashboard" passHref>
                                    <SidebarMenuButton>
                                        <LayoutDashboard />
                                        Dashboard
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <FileUp />
                                    จัดการข้อสอบ
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Shield />
                                    จัดการสิทธิ์
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Users />
                                    จัดการผู้ใช้
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Link href="/" passHref>
                                    <SidebarMenuButton>
                                        <LogOut />
                                        Logout
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>
                <SidebarInset>
                    <header className="flex items-center justify-between p-4 border-b bg-card">
                        <SidebarTrigger />
                        <div className="flex items-center gap-4">
                            <span className="font-medium text-sm hidden sm:inline">Welcome, Admin!</span>
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="https://placehold.co/40x40" alt="Admin avatar" data-ai-hint="admin avatar" />
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                        </div>
                    </header>
                    <main className="p-4 sm:p-6 lg:p-8 bg-background flex-1">
                        {children}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}

