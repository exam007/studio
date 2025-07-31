
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PlusCircle, Search, FileUp, Shield, Users, HelpCircle, Upload } from "lucide-react";
import Image from "next/image";

export default function AdminDashboardPage() {
  return (
    <div className="animate-in fade-in-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">จัดการข้อสอบ, สิทธิ์การเข้าถึง, และผู้ใช้งาน</p>
            </div>
        </div>

        <Tabs defaultValue="exams">
            <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="exams"><FileUp className="mr-2"/>จัดการข้อสอบ</TabsTrigger>
                <TabsTrigger value="permissions"><Shield className="mr-2"/>จัดการสิทธิ์</TabsTrigger>
                <TabsTrigger value="users"><Users className="mr-2"/>จัดการผู้ใช้</TabsTrigger>
            </TabsList>
            <TabsContent value="exams">
                <Card>
                    <CardHeader>
                        <CardTitle>รายการข้อสอบ</CardTitle>
                        <CardDescription>เพิ่ม, แก้ไข, หรือลบข้อสอบในระบบ</CardDescription>
                         <div className="flex items-center gap-2 pt-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="ค้นหาด้วยรหัสข้อสอบ..." className="pl-8 w-full" />
                            </div>
                            
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <HelpCircle className="h-4 w-4" />
                                        <span className="sr-only">ดูตัวอย่างไฟล์</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-96">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">ตัวอย่างฟอร์แมตไฟล์ Sheet</h4>
                                        <p className="text-sm text-muted-foreground">
                                            คอลัมน์ควรเรียงลำดับดังนี้: A=ข้อ, B=คำถาม, C-F=ตัวเลือก, G=เฉลย, H=คำอธิบาย
                                        </p>
                                        <Image src="https://placehold.co/600x400.png" alt="Sheet format example" width={600} height={400} className="rounded-md border" data-ai-hint="spreadsheet table"/>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <Button>
                                <Upload className="mr-2 h-4 w-4" /> อัปโหลดไฟล์
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                       <Table>
                           <TableHeader>
                               <TableRow>
                                   <TableHead>รหัสข้อสอบ</TableHead>
                                   <TableHead>ชื่อข้อสอบ</TableHead>
                                   <TableHead>จำนวนคำถาม</TableHead>
                                   <TableHead className="text-right">จัดการ</TableHead>
                               </TableRow>
                           </TableHeader>
                           <TableBody>
                                <TableRow>
                                    <TableCell>EXM001</TableCell>
                                    <TableCell>General Knowledge Challenge</TableCell>
                                    <TableCell>15</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm">แก้ไข</Button>
                                    </TableCell>
                                </TableRow>
                               <TableRow>
                                    <TableCell>EXM002</TableCell>
                                    <TableCell>World History Deep Dive</TableCell>
                                    <TableCell>25</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm">แก้ไข</Button>
                                    </TableCell>
                                </TableRow>
                           </TableBody>
                       </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="permissions">
                 <Card>
                    <CardHeader>
                        <CardTitle>จัดการสิทธิ์ข้อสอบ</CardTitle>
                        <CardDescription>กำหนดสิทธิ์ให้ผู้ใช้เข้าถึงข้อสอบแต่ละชุด</CardDescription>
                         <div className="flex gap-2 pt-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="ค้นหาด้วย Email หรือรหัสข้อสอบ..." className="pl-8 w-full" />
                            </div>
                            <Button><PlusCircle className="mr-2" /> เพิ่มสิทธิ์</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Access Control Management Table Here */}
                        <p>ตารางจัดการสิทธิ์จะแสดงที่นี่</p>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="users">
                <Card>
                    <CardHeader>
                        <CardTitle>จัดการผู้ใช้งาน</CardTitle>
                        <CardDescription>ดูข้อมูลและสิทธิ์การเข้าถึงของผู้ใช้ทั้งหมด</CardDescription>
                         <div className="relative pt-2">
                            <Search className="absolute left-2.5 top-4 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="ค้นหาด้วย User ID หรือ Email..." className="pl-8 w-full" />
                        </div>
                    </CardHeader>
                    <CardContent>
                       {/* User Management Table Here */}
                        <p>ตารางจัดการผู้ใช้จะแสดงที่นี่</p>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
