
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, PlusCircle, Trash2, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

// Mock data
const MOCK_EXAM_DETAILS = {
  id: 'EXM001',
  name: 'General Knowledge Challenge',
};

const MOCK_USERS_WITH_PERMISSION = [
  { id: 'USR001', email: 'user1@gmail.com', name: 'John Doe' },
  { id: 'USR002', email: 'user2@gmail.com', name: 'Jane Smith' },
];

export default function ManagePermissionsPage({ params }: { params: { id: string } }) {
  const [users, setUsers] = useState(MOCK_USERS_WITH_PERMISSION);
  const [newUserEmails, setNewUserEmails] = useState("");

  const handleAddPermission = () => {
    if (!newUserEmails.trim()) return;

    const emailsToAdd = newUserEmails
        .split(',')
        .map(email => email.trim())
        .filter(email => email && !users.find(u => u.email === email));

    if (emailsToAdd.length > 0) {
      const newUsers = emailsToAdd.map((email, index) => ({
        id: `USR${String(users.length + index + 1).padStart(3, '0')}`,
        email: email,
        name: "New User (Invited)",
      }));
      
      setUsers(prev => [...prev, ...newUsers]);
      setNewUserEmails("");
    }
  };

  const handleRemovePermission = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <div className="animate-in fade-in-50">
      <div className="mb-6">
        <Link href="/admin/dashboard">
            <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4"/>
                กลับไปหน้าหลัก
            </Button>
        </Link>
        <h1 className="text-3xl font-headline font-bold">จัดการสิทธิ์ข้อสอบ</h1>
        <p className="text-muted-foreground mt-1">
          สำหรับข้อสอบ: <span className="font-semibold text-primary">{MOCK_EXAM_DETAILS.name} ({params.id})</span>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>เพิ่มสิทธิ์การเข้าถึง</CardTitle>
          <CardDescription>กรอกอีเมลของผู้ใช้ คั่นด้วยจุลภาค (,) เพื่อเพิ่มสิทธิ์ทีละหลายคน</CardDescription>
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
                {users.map((user) => (
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
              </TableBody>
            </Table>
            {users.length === 0 && (
                <p className="text-center text-muted-foreground py-8">ยังไม่มีผู้ใช้คนใดได้รับสิทธิ์สำหรับข้อสอบนี้</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
