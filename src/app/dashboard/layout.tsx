"use client"
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, PlusCircle, Settings, LogOut, BookOpen } from "lucide-react";
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-background">
                <Sidebar>
                    <SidebarHeader>
                        <div className="flex items-center gap-2 p-2">
                           <BookOpen className="w-8 h-8 text-primary"/>
                           <h2 className="text-2xl font-headline font-semibold text-primary">Examplify</h2>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Link href="/dashboard" passHref>
                                    <SidebarMenuButton>
                                        <Home />
                                        Dashboard
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <Link href="/dashboard/create-quiz" passHref>
                                    <SidebarMenuButton>
                                        <PlusCircle />
                                        Create Quiz
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Settings />
                                    Settings
                                </SidebarMenuButton>
                            </SidebarMenuItem>
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
                            <span className="font-medium text-sm hidden sm:inline">Welcome, User!</span>
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="https://placehold.co/40x40" alt="User avatar" data-ai-hint="user avatar" />
                                <AvatarFallback>U</AvatarFallback>
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
