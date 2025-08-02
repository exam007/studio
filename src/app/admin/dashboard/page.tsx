
"use client"

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  PlusCircle, Search, FileUp, Shield, Users, HelpCircle, Upload, ArrowRight,
  User, BookOpen, Mail, MoreHorizontal, Edit, Trash2, FilePenLine, Loader2
} from "lucide-react";


type Exam = {
    id: string;
    name: string;
    questionCount: number;
    timeInMinutes: number;
}

type UserWithPermissions = {
    id: string;
    email: string;
    name: string;
    avatar: string;
    accessibleExams: { id: string; name: string }[];
}

// Mock data
const MOCK_USERS_DATA: UserWithPermissions[] = [
    {
        id: 'USR001',
        email: 'user1@gmail.com',
        name: 'John Doe',
        avatar: 'https://placehold.co/40x40.png',
        accessibleExams: [
            { id: 'EXM001', name: 'General Knowledge Challenge' },
            { id: 'EXM002', name: 'World History Deep Dive' },
        ],
    },
    {
        id: 'USR002',
        email: 'user2@gmail.com',
        name: 'Jane Smith',
        avatar: 'https://placehold.co/40x40.png',
        accessibleExams: [
            { id: 'EXM001', name: 'General Knowledge Challenge' },
        ],
    },
];

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'exams';

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    // In a real app, you would fetch this data from Firestore
    setExams([
        { id: 'EXM001', name: 'General Knowledge Challenge', questionCount: 15, timeInMinutes: 20 },
        { id: 'EXM002', name: 'World History Deep Dive', questionCount: 25, timeInMinutes: 30 },
    ]);
  }, []);

  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [foundUser, setFoundUser] = useState<UserWithPermissions | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // State for editing exam
  const [examToEdit, setExamToEdit] = useState<Exam | null>(null);
  const [newExamName, setNewExamName] = useState("");
  const [newExamTime, setNewExamTime] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleUserSearch = () => {
      if (!userSearchQuery.trim()) return;
      const user = MOCK_USERS_DATA.find(u => u.email.toLowerCase() === userSearchQuery.toLowerCase().trim());
      setFoundUser(user || null);
      setSearchAttempted(true);
  };

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
            
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 1 });
            
            console.log("Exam data from sheet:", jsonData);

            toast({
              title: "อัปโหลดไฟล์สำเร็จ",
              description: `อ่านข้อมูลจากไฟล์ ${file.name} เรียบร้อยแล้ว`,
            });
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
    event.target.value = '';
  };
  
  const handleDeleteExam = (examId: string) => {
    setExams(prev => prev.filter(exam => exam.id !== examId));
    toast({
        title: "ลบข้อสอบสำเร็จ",
        description: `ข้อสอบรหัส ${examId} ถูกลบออกจากระบบแล้ว`,
    })
  }

  const handleOpenEditDialog = (exam: Exam) => {
    setExamToEdit(exam);
    setNewExamName(exam.name);
    setNewExamTime(String(exam.timeInMinutes));
    setIsEditDialogOpen(true);
  }

  const handleSaveExamChanges = () => {
    if(!examToEdit || !newExamName.trim()) return;

    const time = parseInt(newExamTime, 10);
    if(isNaN(time) || time <= 0) {
        toast({
            title: "เวลาไม่ถูกต้อง",
            description: "กรุณาใส่เวลาเป็นตัวเลขที่มากกว่า 0",
            variant: "destructive"
        })
        return;
    }
    
    setExams(prev => prev.map(exam => 
        exam.id === examToEdit.id ? { ...exam, name: newExamName.trim(), timeInMinutes: time } : exam
    ));

    toast({
        title: "แก้ไขสำเร็จ",
        description: `อัปเดตข้อมูลข้อสอบ "${newExamName.trim()}" เรียบร้อยแล้ว`,
    });
    
    setIsEditDialogOpen(false);
    setExamToEdit(null);
    setNewExamName("");
    setNewExamTime("");
  }
  
  const handleEditQuestions = (examId: string) => {
      router.push(`/admin/edit-exam/${examId}`);
  };

  return (
    <div className="animate-in fade-in-50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">จัดการข้อสอบ, สิทธิ์การเข้าถึง, และผู้ใช้งาน</p>
        </div>
      </div>
      <Tabs value={currentTab} onValueChange={(value) => router.push(`/admin/dashboard?tab=${value}`)} className="w-full">
        <TabsList className="grid w-full max-w-sm grid-cols-3 mx-auto mb-6">
            <TabsTrigger value="exams">
                <FileUp className="mr-2 h-4 w-4"/> จัดการข้อสอบ
            </TabsTrigger>
            <TabsTrigger value="permissions">
                <Shield className="mr-2 h-4 w-4"/> จัดการสิทธิ์
            </TabsTrigger>
            <TabsTrigger value="users">
                <Users className="mr-2 h-4 w-4"/> จัดการผู้ใช้
            </TabsTrigger>
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
                    <TableHead>เวลา (นาที)</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell>{exam.id}</TableCell>
                      <TableCell>{exam.name}</TableCell>
                      <TableCell>{exam.questionCount}</TableCell>
                      <TableCell>{exam.timeInMinutes}</TableCell>
                      <TableCell className="text-right">
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>ตัวเลือก</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleOpenEditDialog(exam)}>
                              <Edit className="mr-2 h-4 w-4" />
                              แก้ไข
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditQuestions(exam.id)}>
                              <FilePenLine className="mr-2 h-4 w-4" />
                              แก้ไขคำถาม
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  ลบข้อสอบ
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>คุณแน่ใจหรือไม่?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    การกระทำนี้ไม่สามารถย้อนกลับได้ การลบข้อสอบจะลบข้อมูลทั้งหมดที่เกี่ยวข้องอย่างถาวร
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteExam(exam.id)} className="bg-destructive hover:bg-destructive/90">
                                    ยืนยันการลบ
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      
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
              <div className="flex items-center gap-2 pt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="ค้นหาด้วย Email..." 
                    className="pl-8 w-full" 
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUserSearch()}
                  />
                </div>
                <Button onClick={handleUserSearch}>ค้นหาผู้ใช้</Button>
              </div>
            </CardHeader>
            <CardContent>
              {searchAttempted ? (
                foundUser ? (
                  <Card className="mt-6 animate-in fade-in-50">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-primary">
                        <AvatarImage src={foundUser.avatar} data-ai-hint="user avatar" />
                        <AvatarFallback>{foundUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{foundUser.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 pt-1">
                          <Mail className="h-4 w-4" /> {foundUser.email}
                        </CardDescription>
                        <Badge variant="secondary" className="mt-2">{foundUser.id}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-semibold mb-3 mt-4 text-base">
                        สิทธิ์การเข้าถึงข้อสอบ ({foundUser.accessibleExams.length} รายการ)
                      </h3>
                      {foundUser.accessibleExams.length > 0 ? (
                        <div className="border rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>รหัสข้อสอบ</TableHead>
                                <TableHead>ชื่อข้อสอบ</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {foundUser.accessibleExams.map(exam => (
                                <TableRow key={exam.id}>
                                  <TableCell><Badge variant="outline">{exam.id}</Badge></TableCell>
                                  <TableCell>{exam.name}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">ผู้ใช้ยังไม่มีสิทธิ์เข้าถึงข้อสอบใดๆ</p>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-16 border-2 border-dashed rounded-lg mt-6">
                    <User className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">ไม่พบผู้ใช้งาน</h3>
                    <p className="mt-1 text-sm text-muted-foreground">ไม่พบผู้ใช้ด้วยอีเมลที่คุณค้นหา</p>
                  </div>
                )
              ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg mt-6">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">ค้นหาผู้ใช้</h3>
                  <p className="mt-1 text-sm text-muted-foreground">กรอกอีเมลของผู้ใช้เพื่อดูสิทธิ์การเข้าถึงข้อสอบ</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>แก้ไขข้อมูลข้อสอบ</DialogTitle>
            <DialogDescription>
              เปลี่ยนชื่อและเวลาในการทำข้อสอบสำหรับรหัส {examToEdit?.id}. กดบันทึกเพื่อยืนยัน
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                ชื่อข้อสอบ
              </Label>
              <Input
                id="name"
                value={newExamName}
                onChange={(e) => setNewExamName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                เวลา (นาที)
              </Label>
              <Input
                id="time"
                type="number"
                value={newExamTime}
                onChange={(e) => setNewExamTime(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                ยกเลิก
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleSaveExamChanges}>บันทึก</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminDashboardPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <DashboardContent />
        </Suspense>
    );
};
