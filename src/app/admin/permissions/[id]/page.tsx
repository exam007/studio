
"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, PlusCircle, Trash2, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

type User = {
  id: string;
  email: string;
  name: string;
}

type ExamDetails = {
    id: string;
    name: string;
}

export default function ManagePermissionsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [examDetails, setExamDetails] = useState<ExamDetails | null>(null);
  const [usersWithPermission, setUsersWithPermission] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [newUserEmails, setNewUserEmails] = useState("");

  useEffect(() => {
    // Load exam details
    const storedExam = localStorage.getItem(`exam_details_${id}`);
    if (storedExam) {
        setExamDetails(JSON.parse(storedExam));
    }
    
    // Load all users from localStorage
    const storedAllUsers: User[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("user_")) {
            const user = JSON.parse(localStorage.getItem(key)!);
            storedAllUsers.push(user);
        }
    }
    setAllUsers(storedAllUsers);
    
    // Load users who already have permission for this exam
    const storedPermissions = localStorage.getItem(`permissions_${id}`);
    if(storedPermissions) {
        const userIdsWithPermission: string[] = JSON.parse(storedPermissions);
        setUsersWithPermission(storedAllUsers.filter(u => userIdsWithPermission.includes(u.id)));
    }

  }, [id]);

  const handleAddPermission = () => {
    if (!newUserEmails.trim()) return;

    const emailsToAdd = newUserEmails
        .split(',')
        .map(email => email.trim().toLowerCase())
        .filter(Boolean);

    const usersToGrantPermission = allUsers.filter(u => emailsToAdd.includes(u.email.toLowerCase()));

    if (usersToGrantPermission.length > 0) {
      const updatedUsersWithPermission = [...usersWithPermission];
      usersToGrantPermission.forEach(userToAdd => {
          if (!updatedUsersWithPermission.find(u => u.id === userToAdd.id)) {
              updatedUsersWithPermission.push(userToAdd);
          }
      });
      
      setUsersWithPermission(updatedUsersWithPermission);
      const updatedUserIds = updatedUsersWithPermission.map(u => u.id);
      localStorage.setItem(`permissions_${id}`, JSON.stringify(updatedUserIds));
      setNewUserEmails("");
    }
  };

  const handleRemovePermission = (userId: string) => {
    const updatedUsers = usersWithPermission.filter(u => u.id !== userId);
    setUsersWithPermission(updatedUsers);
    const updatedUserIds = updatedUsers.map(u => u.id);
    localStorage.setItem(`permissions_${id}`, JSON.stringify(updatedUserIds));
  };

  return (
    <div className="animate-in fade-in-50 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/dashboard?tab=exams">
            <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4"/>
                กลับไปหน้าหลัก
            </Button>
        </Link>
        <h1 className="text-3xl font-headline font-bold">จัดการสิทธิ์ข้อสอบ</h1>
        <p className="text-muted-foreground mt-1">
          สำหรับข้อสอบ: <span className="font-semibold text-primary">{examDetails?.name} ({id})</span>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>เพิ่มสิทธิ์การเข้าถึง</CardTitle>
          <CardDescription>กรอกอีเมลของผู้ใช้ที่ลงทะเบียนแล้วในระบบ คั่นด้วยจุลภาค (,) เพื่อเพิ่มสิทธิ์ทีละหลายคน</CardDescription>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <div className="relative flex-1">
              <ShieldCheck className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Textarea 
                placeholder="user1@gmail.com, user2@gmail.com" 
                className="pl-8 w-full" 
                value={newUserEmails}
                onChange={(e) => setNewUserEmails(e.target.value)}
                rows={2}
              />
            </div>
            <Button onClick={handleAddPermission} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> เพิ่มสิทธิ์
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-2">ผู้ใช้ที่มีสิทธิ์แล้ว</h3>
             <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="ค้นหาด้วยอีเมล..." className="pl-8 w-full" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>ชื่อ</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersWithPermission.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                        <Badge variant="secondary">{user.id}</Badge>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" onClick={() => handleRemovePermission(user.id)}>
                        <Trash2 className="mr-1 h-4 w-4" />
                        ลบสิทธิ์
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                 {usersWithPermission.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">ยังไม่มีผู้ใช้คนใดได้รับสิทธิ์สำหรับข้อสอบนี้</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    
