
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PlusCircle, Search, FileUp, Shield, Users, HelpCircle, Upload, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import * as XLSX from 'xlsx';
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

type Exam = {
    id: string;
    name: string;
    questionCount: number;
}

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exams, setExams] = useState<Exam[]>([
      { id: 'EXM001', name: 'General Knowledge Challenge', questionCount: 15 },
      { id: 'EXM002', name: 'World History Deep Dive', questionCount: 25 },
  ]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // Start reading from the second row (index 1)
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 1 });
            
            // For now, we'll log the data to the console to verify it.
            // In the next step, we'll process this data to create a new exam.
            console.log("Exam data from sheet:", jsonData);

            toast({
              title: "อัปโหลดไฟล์สำเร็จ",
              description: `อ่านข้อมูลจากไฟล์ ${file.name} เรียบร้อยแล้ว`,
            });
            // Here you would process jsonData to create a new exam and add it to the state
            // For example:
            // const newExam = { ... };
            // setExams(prev => [...prev, newExam]);

        } catch (error) {
            console.error("Error reading the file:", error);
            toast({
              title: "เกิดข้อผิดพลาด",
              description: "ไม่สามารถอ่านข้อมูลจากไฟล์ได้ โปรดตรวจสอบฟอร์แมต",
              variant: "destructive",
            });
        }
    };
    reader.readAsBinaryString(file);

    // Reset file input to allow uploading the same file again
    event.target.value = '';
  };


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
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            />
                            <Button onClick={handleUploadClick}>
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
                                {exams.map((exam) => (
                                    <TableRow key={exam.id}>
                                        <TableCell>{exam.id}</TableCell>
                                        <TableCell>{exam.name}</TableCell>
                                        <TableCell>{exam.questionCount}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm">แก้ไข</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                           </TableBody>
                       </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="permissions">
                 <Card>
                    <CardHeader>
                        <CardTitle>จัดการสิทธิ์ข้อสอบ</CardTitle>
                        <CardDescription>เลือกข้อสอบเพื่อจัดการสิทธิ์การเข้าถึงของผู้ใช้</CardDescription>
                         <div className="relative pt-2">
                            <Search className="absolute left-2.5 top-4 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="ค้นหาด้วยชื่อหรือรหัสข้อสอบ..." className="pl-8 w-full" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>รหัสข้อสอบ</TableHead>
                                    <TableHead>ชื่อข้อสอบ</TableHead>
                                    <TableHead className="text-right">จัดการสิทธิ์</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {exams.map((exam) => (
                                    <TableRow key={exam.id}>
                                        <TableCell>{exam.id}</TableCell>
                                        <TableCell>{exam.name}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/admin/permissions/${exam.id}`}>
                                                <Button variant="outline" size="sm">
                                                    จัดการ <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                           </TableBody>
                        </Table>
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
