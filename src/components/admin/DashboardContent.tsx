

"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
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
  FileUp, Users, HelpCircle, Upload, ShieldCheck,
  MoreHorizontal, Edit, Trash2, FilePenLine, PlusCircle, Check, X, UserCheck
} from "lucide-react";
import type { Question, Option } from '@/app/admin/edit-exam/[id]/page';


export type Exam = {
    id: string;
    name: string;
    questionCount: number;
    timeInMinutes: number;
    year: number;
}

export type UserProfile = {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

export type PendingRequest = {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
};

const ExamsTabContent = ({ exams, handleOpenEditDialog, handleEditQuestions, handleDeleteExam, fileInputRef, handleFileChange, handleUploadClick, handleCreateNewExam, handleManagePermissions }: any) => (
     <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <CardTitle>รายการข้อสอบ</CardTitle>
                    <CardDescription>เพิ่ม, แก้ไข, หรือลบข้อสอบในระบบ</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleCreateNewExam}>
                      <PlusCircle className="mr-2 h-4 w-4" /> สร้างข้อสอบใหม่
                    </Button>
                    <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    />
                    <Button onClick={handleUploadClick} variant="outline">
                    <Upload className="mr-2 h-4 w-4" /> อัปโหลดไฟล์
                    </Button>
                </div>
            </div>
            <div className="flex items-center gap-2 pt-4">
                <Input placeholder="ค้นหาด้วยรหัสข้อสอบ..." className="w-full" />
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
                 <TableHead>ปี</TableHead>
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
                  <TableCell>{exam.year}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleManagePermissions(exam.id)}>
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            จัดการสิทธิ์
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
                    <TableCell colSpan={6} className="h-24 text-center">
                        ยังไม่มีข้อสอบในระบบ
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
);

const UsersTabContent = ({ users, isAddUserDialogOpen, setIsAddUserDialogOpen, handleAddNewUser, newUserName, setNewUserName, newUserEmail, setNewUserEmail, handleDeleteUser }: any) => {
    return (
    <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <CardTitle>จัดการผู้ใช้งาน</CardTitle>
                        <CardDescription>เพิ่ม, ลบ, และดูข้อมูลผู้ใช้ในระบบ</CardDescription>
                    </div>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            เพิ่มสมาชิกใหม่
                        </Button>
                    </DialogTrigger>
                </div>
                <div className="flex items-center gap-2 pt-4">
                    <Input placeholder="ค้นหาด้วย Email..." className="w-full" />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User ID</TableHead>
                            <TableHead>Avatar</TableHead>
                            <TableHead>ชื่อ</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">จัดการ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user: UserProfile) => (
                            <TableRow key={user.id}>
                                <TableCell><Badge variant="secondary">{user.id}</Badge></TableCell>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={user.avatar} data-ai-hint="user avatar" />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="text-right">
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>ยืนยันการลบผู้ใช้?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ {user.name} ({user.email})? การกระทำนี้ไม่สามารถย้อนกลับได้
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-destructive hover:bg-destructive/90">
                                            ยืนยัน
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                         {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    ยังไม่มีสมาชิกในระบบ
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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


const RequestsTabContent = ({ pendingRequests, handleApproveRequest, handleRejectRequest }: any) => (
    <Card>
        <CardHeader>
            <CardTitle>คำขออนุมัติเข้าสู่ระบบ</CardTitle>
            <CardDescription>
                จัดการคำขอของผู้ใช้ใหม่ที่ต้องการเข้าถึงระบบ
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Avatar</TableHead>
                        <TableHead>ชื่อ</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">การดำเนินการ</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pendingRequests.length > 0 ? (
                        pendingRequests.map((req: PendingRequest) => (
                        <TableRow key={req.uid}>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src={req.photoURL} data-ai-hint="user avatar" />
                                    <AvatarFallback>{req.displayName.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>{req.displayName}</TableCell>
                            <TableCell>{req.email}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleRejectRequest(req.uid)}>
                                    <X className="mr-1 h-4 w-4" /> ปฏิเสธ
                                </Button>
                                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleApproveRequest(req)}>
                                   <Check className="mr-1 h-4 w-4" /> อนุมัติ
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                ไม่มีคำขอที่รอการอนุมัติ
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

export function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'exams';

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [exams, setExams] = useState<Exam[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);


  // State for editing exam
  const [examToEdit, setExamToEdit] = useState<Exam | null>(null);
  const [newExamName, setNewExamName] = useState("");
  const [newExamTime, setNewExamTime] = useState("");
  const [newExamYear, setNewExamYear] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // State for adding a new user
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  const refreshDataFromLocalStorage = () => {
    try {
        const storedExams: Exam[] = [];
        let storedUsers: UserProfile[] = [];
        let hasUsers = false;

        const storedRequests = localStorage.getItem("pending_requests");
        setPendingRequests(storedRequests ? JSON.parse(storedRequests) : []);

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('exam_details_')) {
                const exam = JSON.parse(localStorage.getItem(key)!);
                const questions = JSON.parse(localStorage.getItem(`exam_questions_${exam.id}`) || '[]');
                exam.questionCount = questions.length;
                // Add default year for backward compatibility
                exam.year = exam.year || new Date().getFullYear() + 543;
                storedExams.push(exam);
            } else if (key?.startsWith('user_')) {
                hasUsers = true;
                storedUsers.push(JSON.parse(localStorage.getItem(key)!));
            }
        }
        
        if (!hasUsers) {
            const defaultUser: UserProfile = {
                id: uuidv4(),
                name: "Narongtorn S.",
                email: "narongtorn.s@attorney285.co.th",
                avatar: `https://placehold.co/40x40.png?text=N`,
            };
            localStorage.setItem(`user_${defaultUser.id}`, JSON.stringify(defaultUser));
            storedUsers = [defaultUser];
        }
        
        setExams(storedExams);
        setUsers(storedUsers);
    } catch (error) {
        console.error("Could not load data from localStorage", error);
        toast({ title: "เกิดข้อผิดพลาด", description: "ไม่สามารถโหลดข้อมูลที่บันทึกไว้ได้", variant: "destructive" });
    }
  };


  // Load data from localStorage on initial render
  useEffect(() => {
    refreshDataFromLocalStorage();
  }, []);

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
            
            // Start from the second row (index 1) to skip header
            const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 1 });
            
            const newExamId = uuidv4();

            const questions: Question[] = jsonData.map((row: any): Question => {
                const options: Option[] = [
                    { id: uuidv4(), text: String(row[2] || '') },
                    { id: uuidv4(), text: String(row[3] || '') },
                    { id: uuidv4(), text: String(row[4] || '') },
                    { id: uuidv4(), text: String(row[5] || '') },
                ].filter(opt => opt.text);

                // Find the correct option object to get its id
                const correctOption = options.find(opt => opt.text === String(row[6] || ''));

                return {
                    id: uuidv4(),
                    type: 'mcq', // Assuming all questions from excel are mcq
                    text: String(row[1] || ''),
                    options: options,
                    correctAnswer: correctOption ? correctOption.id : ''
                };
            });

            const newExam: Exam = {
              id: newExamId,
              name: file.name.replace(/\.[^/.]+$/, ""), // Use filename as exam name
              questionCount: questions.length,
              timeInMinutes: 30, // Default time
              year: new Date().getFullYear() + 543,
            };
            
            const updatedExams = [...exams, newExam];
            setExams(updatedExams);
            localStorage.setItem(`exam_details_${newExam.id}`, JSON.stringify(newExam));
            localStorage.setItem(`exam_questions_${newExam.id}`, JSON.stringify(questions));

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
    const updatedExams = exams.filter(exam => exam.id !== examId)
    setExams(updatedExams);
    localStorage.removeItem(`exam_details_${examId}`);
    localStorage.removeItem(`exam_questions_${examId}`);
    localStorage.removeItem(`permissions_${examId}`); // Also remove permissions
    toast({
        title: "ลบข้อสอบสำเร็จ",
        description: `ข้อสอบรหัส ${examId} ถูกลบออกจากระบบแล้ว`,
    })
  }

  const handleOpenEditDialog = (exam: Exam) => {
    setExamToEdit(exam);
    setNewExamName(exam.name);
    setNewExamTime(String(exam.timeInMinutes));
    setNewExamYear(String(exam.year));
    setIsEditDialogOpen(true);
  }

  const handleSaveExamChanges = () => {
    if(!examToEdit || !newExamName.trim()) return;

    const time = parseInt(newExamTime, 10);
    const year = parseInt(newExamYear, 10);

    if(isNaN(time) || time <= 0) {
        toast({ title: "เวลาไม่ถูกต้อง", description: "กรุณาใส่เวลาเป็นตัวเลขที่มากกว่า 0", variant: "destructive" });
        return;
    }
    if(isNaN(year) || year < 2500) {
        toast({ title: "ปีไม่ถูกต้อง", description: "กรุณาใส่ปี พ.ศ. ที่ถูกต้อง", variant: "destructive" });
        return;
    }
    
    const updatedExam = { ...examToEdit, name: newExamName.trim(), timeInMinutes: time, year: year };
    const updatedExams = exams.map(exam => 
        exam.id === examToEdit.id ? updatedExam : exam
    );
    setExams(updatedExams);
    localStorage.setItem(`exam_details_${examToEdit.id}`, JSON.stringify(updatedExam));

    toast({
        title: "แก้ไขสำเร็จ",
        description: `อัปเดตข้อมูลข้อสอบ "${newExamName.trim()}" เรียบร้อยแล้ว`,
    });
    
    setIsEditDialogOpen(false);
    setExamToEdit(null);
  }
  
  const handleEditQuestions = (examId: string) => {
      router.push(`/admin/edit-exam/${examId}`);
  };

  const handleManagePermissions = (examId: string) => {
    router.push(`/admin/permissions/${examId}`);
  };

  const handleCreateNewExam = () => {
    const newExamId = uuidv4();
    const newExam: Exam = {
      id: newExamId,
      name: `ข้อสอบใหม่ ${exams.length + 1}`,
      questionCount: 0,
      timeInMinutes: 20, // Default time
      year: new Date().getFullYear() + 543,
    };
    const updatedExams = [...exams, newExam];
    setExams(updatedExams);
    localStorage.setItem(`exam_details_${newExamId}`, JSON.stringify(newExam));
    // Also create an empty questions array
    localStorage.setItem(`exam_questions_${newExamId}`, JSON.stringify([]));
    router.push(`/admin/edit-exam/${newExamId}`);
  };

  const handleAddNewUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
        toast({
            title: "ข้อมูลไม่ครบถ้วน",
            description: "กรุณากรอกชื่อและอีเมลให้ครบถ้วน",
            variant: "destructive"
        });
        return;
    }
    
    // Check for duplicate email
    const isDuplicate = users.some(user => user.email.toLowerCase() === newUserEmail.trim().toLowerCase());
    if (isDuplicate) {
        toast({
            title: "อีเมลซ้ำ",
            description: "มีผู้ใช้งานอีเมลนี้ในระบบแล้ว",
            variant: "destructive"
        });
        return;
    }

    const newUser: UserProfile = {
        id: uuidv4(),
        name: newUserName.trim(),
        email: newUserEmail.trim().toLowerCase(),
        avatar: `https://placehold.co/40x40.png?text=${newUserName.trim().charAt(0)}`,
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem(`user_${newUser.id}`, JSON.stringify(newUser));

    toast({
        title: "เพิ่มสมาชิกสำเร็จ",
        description: `เพิ่มคุณ ${newUser.name} (${newUser.email}) เข้าระบบแล้ว`,
    });
    
    setNewUserName("");
    setNewUserEmail("");
    setIsAddUserDialogOpen(false);
  }

  const handleDeleteUser = (userId: string) => {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      localStorage.removeItem(`user_${userId}`);

      // Also remove user's permissions from all exams
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if(key && key.startsWith('permissions_')) {
            const permissions = JSON.parse(localStorage.getItem(key)!);
            const updatedPermissions = permissions.filter((id: string) => id !== userId);
            localStorage.setItem(key, JSON.stringify(updatedPermissions));
        }
      }

      toast({
          title: "ลบผู้ใช้สำเร็จ",
          description: "ผู้ใช้ถูกลบออกจากระบบแล้ว",
      });
  }

  const handleApproveRequest = (request: PendingRequest) => {
    // Add to users list
    const newUser: UserProfile = {
      id: request.uid,
      name: request.displayName,
      email: request.email,
      avatar: request.photoURL,
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem(`user_${newUser.id}`, JSON.stringify(newUser));

    // Remove from pending list
    handleRejectRequest(request.uid, false); // silent rejection
    toast({
        title: "อนุมัติสำเร็จ",
        description: `ผู้ใช้ ${request.displayName} ได้รับการอนุมัติแล้ว`,
    });
  };

  const handleRejectRequest = (uid: string, showToast = true) => {
    const updatedRequests = pendingRequests.filter(req => req.uid !== uid);
    setPendingRequests(updatedRequests);
    localStorage.setItem('pending_requests', JSON.stringify(updatedRequests));
     // Manually trigger storage event for other tabs like the sidebar
    window.dispatchEvent(new Event('storage'));
    if (showToast) {
        toast({
            title: "ปฏิเสธคำขอ",
            description: "คำขอของผู้ใช้ถูกปฏิเสธแล้ว",
            variant: "destructive"
        });
    }
  };

  const renderContent = () => {
    switch (currentTab) {
        case 'exams':
            return (
            <div className="space-y-6">
                <h1 className="text-3xl font-headline font-bold">จัดการข้อสอบ</h1>
                <ExamsTabContent 
                    exams={exams} 
                    handleOpenEditDialog={handleOpenEditDialog} 
                    handleEditQuestions={handleEditQuestions} 
                    handleDeleteExam={handleDeleteExam} 
                    fileInputRef={fileInputRef} 
                    handleFileChange={handleFileChange} 
                    handleUploadClick={handleUploadClick} 
                    handleCreateNewExam={handleCreateNewExam}
                    handleManagePermissions={handleManagePermissions}
                />
            </div>
            );
        case 'users':
            return (
            <div className="space-y-6">
                <h1 className="text-3xl font-headline font-bold">จัดการผู้ใช้</h1>
                <UsersTabContent 
                    users={users}
                    isAddUserDialogOpen={isAddUserDialogOpen} 
                    setIsAddUserDialogOpen={setIsAddUserDialogOpen} 
                    handleAddNewUser={handleAddNewUser}
                    newUserName={newUserName} 
                    setNewUserName={setNewUserName}
                    newUserEmail={newUserEmail}
                    setNewUserEmail={setNewUserEmail}
                    handleDeleteUser={handleDeleteUser}
                />
            </div>);
        case 'requests':
            return (
            <div className="space-y-6">
                 <h1 className="text-3xl font-headline font-bold">คำขออนุมัติ</h1>
                <RequestsTabContent 
                    pendingRequests={pendingRequests}
                    handleApproveRequest={handleApproveRequest}
                    handleRejectRequest={handleRejectRequest}
                />
            </div>
            );
        default:
             return (
            <div className="space-y-6">
                <h1 className="text-3xl font-headline font-bold">จัดการข้อสอบ</h1>
                <ExamsTabContent 
                    exams={exams} 
                    handleOpenEditDialog={handleOpenEditDialog} 
                    handleEditQuestions={handleEditQuestions} 
                    handleDeleteExam={handleDeleteExam} 
                    fileInputRef={fileInputRef} 
                    handleFileChange={handleFileChange} 
                    handleUploadClick={handleUploadClick} 
                    handleCreateNewExam={handleCreateNewExam}
                    handleManagePermissions={handleManagePermissions}
                />
            </div>
            );
    }
  }

  return (
    <div className="animate-in fade-in-50">
      {renderContent()}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>แก้ไขข้อมูลข้อสอบ</DialogTitle>
            <DialogDescription>
              เปลี่ยนชื่อ, เวลา และปีของข้อสอบสำหรับรหัส {examToEdit?.id}.
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year" className="text-right">
                ปี (พ.ศ.)
              </Label>
              <Input
                id="year"
                type="number"
                value={newExamYear}
                onChange={(e) => setNewExamYear(e.target.value)}
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
