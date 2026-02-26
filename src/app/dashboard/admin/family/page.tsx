
'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Users } from "lucide-react";

// This is a local type definition for the User, matching the one in auth-provider
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  username: string | null;
  isPaid?: boolean;
  plan?: string;
  isFriendAndFamily?: boolean;
  referrer?: string | null;
}

const MOCK_USER_DB_KEY = 'mock_user_db';

const getMockUserDB = (): User[] => {
  if (typeof window === 'undefined') return [];
  try {
    const db = window.localStorage.getItem(MOCK_USER_DB_KEY);
    return db ? JSON.parse(db) : [];
  } catch {
    return [];
  }
};

export default function AdminFamilyPage() {
    const [familyMembers, setFamilyMembers] = useState<User[]>([]);

    useEffect(() => {
        const allUsers = getMockUserDB();
        const family = allUsers.filter(user => user.isFriendAndFamily);
        setFamilyMembers(family);
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <UserCheck />
                    Friends & Family List
                </CardTitle>
                <CardDescription>
                    This is a list of all registered users who have been granted free, full-access "Family" status.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {familyMembers.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Display Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Referred By</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {familyMembers.map((member) => (
                                <TableRow key={member.uid}>
                                    <TableCell className="font-medium">{member.displayName}</TableCell>
                                    <TableCell>{member.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="default">{member.plan}</Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{member.referrer || 'N/A'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <Users className="mx-auto h-12 w-12 mb-4"/>
                        <h3 className="text-lg font-semibold">No Family Members Yet</h3>
                        <p>Newly registered users with "Family" status will appear here.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
