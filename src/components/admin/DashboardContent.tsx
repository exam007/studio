
"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  FileUp, Users, HelpCircle, Upload, ArrowRight,
  User, Mail, MoreHorizontal, Edit, Trash2, FilePenLine, PlusCircle
} from "lucide-react";


export type Exam = {
    id: string;
    name: string;
    questionCount: number;
    timeInMinutes: number;
}

export type UserWithPermissions = {
    id: string;
    email: string;
    name: string;
    avatar: string;
    accessibleExams: { id: string; name: string }[];
}

const ExamsTabContent = ({ exams, handleOpenEditDialog, handleEditQuestions, handleDeleteExam, fileInputRef, handleFileChange, handleUploadClick, handleCreateNewExam }: any) => (
    <Card>
        <CardHeader>
          <CardTitle>รายการข้อสอบ</CardTitle>
          <CardDescription>เพิ่ม, แก้ไข, หรือลบข้อสอบในระบบ</CardDescription>
          <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-2">
            <Input placeholder="ค้นหาด้วยรหัสข้อสอบ..." className="w-full" />
            
            <div className="flex items-center gap-2">
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="flex-shrink-0">
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
                <Button onClick={handleUploadClick} variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" /> อัปโหลดไฟล์
                </Button>
                <Button onClick={handleCreateNewExam} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> สร้างข้อสอบใหม่
                </Button>
            </div>
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
              {exams.length > 0 ? exams.map((exam: Exam) => (
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
              )) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        ยังไม่มีข้อสอบในระบบ
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
);

const UsersTabContent = ({ users, setUsers, isAddUserDialogOpen, setIsAddUserDialogOpen, userSearchQuery, setUserSearchQuery, handleUserSearch, searchAttempted, foundUser, newUserName, setNewUserName, newUserEmail, setNewUserEmail }: any) => {
    
    const { toast } = useToast();

    const handleAddNewUser = () => {
        if (!newUserName.trim() || !newUserEmail.trim()) {
            toast({
                title: "ข้อมูลไม่ครบถ้วน",
                description: "กรุณากรอกชื่อและอีเมลให้ครบถ้วน",
                variant: "destructive"
            });
            return;
        }

        const newUser: UserWithPermissions = {
            id: `USR${String(users.length + 1).padStart(3, '0')}`,
            name: newUserName.trim(),
            email: newUserEmail.trim(),
            avatar: `https://placehold.co/40x40.png?text=${newUserName.charAt(0)}`,
            accessibleExams: []
        };
        
        setUsers((prevUsers: UserWithPermissions[]) => [...prevUsers, newUser]);

        toast({
            title: "เพิ่มสมาชิกสำเร็จ",
            description: `เพิ่มคุณ ${newUserName} (${newUserEmail}) เข้าระบบแล้ว`,
        });
        
        setNewUserName("");
        setNewUserEmail("");
        setIsAddUserDialogOpen(false);
    }
    
    return (
    <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <CardTitle>จัดการผู้ใช้งาน</CardTitle>
                    <CardDescription>ดูข้อมูล, ค้นหา, และเพิ่มผู้ใช้ใหม่ในระบบ</CardDescription>
                </div>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        เพิ่มสมาชิกใหม่
                    </Button>
                </DialogTrigger>
            </div>
            <div className="flex items-center gap-2 pt-4">
            <div className="relative flex-1">
                <Input 
                placeholder="ค้นหาด้วย Email..." 
                className="w-full" 
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
                            {foundUser.accessibleExams.map((exam: Exam) => (
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
                <User className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">ค้นหาผู้ใช้</h3>
                <p className="mt-1 text-sm text-muted-foreground">กรอกอีเมลของผู้ใช้เพื่อดูสิทธิ์การเข้าถึงข้อสอบ</p>
            </div>
            )}
        </CardContent>
        </Card>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>เพิ่มสมาชิกใหม่</DialogTitle>
            <DialogDescription>
                กรอกข้อมูลเพื่อสร้างบัญชีผู้ใช้ใหม่ในระบบ
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="new-user-name" className="text-right">
                    ชื่อ-สกุล
                    </Label>
                    <Input
                    id="new-user-name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="col-span-3"
                    placeholder="John Doe"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="new-user-email" className="text-right">
                    อีเมล
                    </Label>
                    <Input
                    id="new-user-email"
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="col-span-3"
                    placeholder="user@example.com"
                    />
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>ยกเลิก</Button>
                <Button type="submit" onClick={handleAddNewUser}>บันทึก</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    );
};

export function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'exams';

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [exams, setExams] = useState<Exam[]>([]);
  const [users, setUsers] = useState<UserWithPermissions[]>([]);

  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [foundUser, setFoundUser] = useState<UserWithPermissions | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // State for editing exam
  const [examToEdit, setExamToEdit] = useState<Exam | null>(null);
  const [newExamName, setNewExamName] = useState("");
  const [newExamTime, setNewExamTime] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // State for adding a new user
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  const handleUserSearch = () => {
      if (!userSearchQuery.trim()) return;
      const user = users.find(u => u.email.toLowerCase() === userSearchQuery.toLowerCase().trim());
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
            
            const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 1 });
            
            const newExam: Exam = {
              id: `EXM${String(exams.length + 1).padStart(3, '0')}`,
              name: file.name.replace(/\.[^/.]+$/, ""), // Use filename as exam name
              questionCount: jsonData.length,
              timeInMinutes: 30 // Default time
            };
            setExams(prev => [...prev, newExam]);

            // We would also need to store the questions somewhere, maybe in localStorage for this prototype
            localStorage.setItem(`exam_questions_${newExam.id}`, JSON.stringify(jsonData));

            toast({
              title: "อัปโหลดไฟล์สำเร็จ",
              description: `สร้างข้อสอบ "${newExam.name}" จำนวน ${newExam.questionCount} ข้อเรียบร้อยแล้ว`,
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
    localStorage.removeItem(`exam_questions_${examId}`);
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

  const handleCreateNewExam = () => {
    const newExamId = `EXM${String(exams.length + 1).padStart(3, '0')}`;
    const newExam: Exam = {
      id: newExamId,
      name: `ข้อสอบใหม่ ${exams.length + 1}`,
      questionCount: 0,
      timeInMinutes: 20, // Default time
    };
    setExams(prev => [...prev, newExam]);
    router.push(`/admin/edit-exam/${newExamId}`);
  };

  const renderContent = () => {
    switch (currentTab) {
        case 'exams':
            return <ExamsTabContent exams={exams} handleOpenEditDialog={handleOpenEditDialog} handleEditQuestions={handleEditQuestions} handleDeleteExam={handleDeleteExam} fileInputRef={fileInputRef} handleFileChange={handleFileChange} handleUploadClick={handleUploadClick} handleCreateNewExam={handleCreateNewExam} />;
        case 'users':
            return <UsersTabContent users={users} setUsers={setUsers} isAddUserDialogOpen={isAddUserDialogOpen} setIsAddUserDialogOpen={setIsAddUserDialogOpen} userSearchQuery={userSearchQuery} setUserSearchQuery={setUserSearchQuery} handleUserSearch={handleUserSearch} searchAttempted={searchAttempted} foundUser={foundUser} newUserName={newUserName} setNewUserName={setNewUserName} newUserEmail={newUserEmail} setNewUserEmail={setNewUserEmail} />;
        default:
            return <ExamsTabContent exams={exams} handleOpenEditDialog={handleOpenEditDialog} handleEditQuestions={handleEditQuestions} handleDeleteExam={handleDeleteExam} fileInputRef={fileInputRef} handleFileChange={handleFileChange} handleUploadClick={handleUploadClick} handleCreateNewExam={handleCreateNewExam} />;
    }
  }

  return (
    <div className="animate-in fade-in-50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">จัดการข้อสอบ, สิทธิ์การเข้าถึง, และผู้ใช้งาน</p>
        </div>
      </div>
      
      {renderContent()}

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
