import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { getUsers } from '../../services/authService.ts';
import type { User } from '../../types/index.ts';

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Load users on mount
  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  // Format date for display
  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      { accessorKey: 'name', header: 'Name', size: 150 },
      { accessorKey: 'email', header: 'Email', size: 200 },
      { accessorKey: 'membershipId', header: 'Membership ID', size: 140 },
      {
        accessorKey: 'role',
        header: 'Role',
        size: 100,
        Cell: ({ cell }) => {
          const role = cell.getValue<string>();
          return (
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: role === 'admin' ? '#ede7f6' : '#e3f2fd',
                color: role === 'admin' ? '#4527a0' : '#1565c0',
                textTransform: 'uppercase',
              }}
            >
              {role}
            </span>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Joined',
        size: 120,
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
      },
    ],
    []
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={users}
      state={{ isLoading: loading }}
      enableEditing={false}
      muiTablePaperProps={{ sx: { boxShadow: 'none' } }}
    />
  );
}
