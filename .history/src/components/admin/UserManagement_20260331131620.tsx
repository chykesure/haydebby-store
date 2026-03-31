'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Loader2,
  Search,
  MoreHorizontal,
  UserPlus,
  ShieldCheck,
  UserX,
  Eye,
  RefreshCw,
  Users,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import CreateUserDialog from './CreateUserDialog';
import type { User } from '@/types';

export default function UserManagement() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [createOpen, setCreateOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch users',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchUsers();
    }
  }, [session, fetchUsers]);

  const handleToggleStatus = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggleStatus' }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: `User status updated`,
        });
        fetchUsers();
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      });
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'changeRole', role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: `User role updated to ${newRole}`,
        });
        fetchUsers();
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole =
      roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage customer and admin accounts
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="text-white font-medium"
          style={{ backgroundColor: '#1A9B8C' }}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchUsers}
              disabled={loading}
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-sm font-medium text-gray-900">No users found</h3>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">User</TableHead>
                  <TableHead className="hidden sm:table-cell">Role</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Joined</TableHead>
                  <TableHead className="hidden lg:table-cell">Orders</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback
                            className="text-white text-xs font-semibold"
                            style={{ backgroundColor: '#1A9B8C' }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant="secondary"
                        className={
                          user.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 hover:bg-purple-50'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-100'
                        }
                      >
                        {user.role === 'admin' ? (
                          <><ShieldCheck className="h-3 w-3 mr-1" /> Admin</>
                        ) : (
                          'Customer'
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant="secondary"
                        className={
                          user.isActive
                            ? 'bg-green-50 text-green-700 hover:bg-green-50'
                            : 'bg-red-50 text-red-700 hover:bg-red-50'
                        }
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-gray-500">
                      {user._count?.orders || 0}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(user.id)}
                          >
                            {user.isActive ? (
                              <><UserX className="mr-2 h-4 w-4" /> Deactivate</>
                            ) : (
                              <><ShieldCheck className="mr-2 h-4 w-4" /> Activate</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleChangeRole(
                                user.id,
                                user.role === 'admin' ? 'customer' : 'admin'
                              )
                            }
                          >
                            {user.role === 'admin' ? (
                              <><User className="mr-2 h-4 w-4" /> Make Customer</>
                            ) : (
                              <><ShieldCheck className="mr-2 h-4 w-4" /> Make Admin</>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreateUserDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={fetchUsers}
      />
    </div>
  );
}
