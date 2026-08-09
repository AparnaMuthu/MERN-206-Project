import { useState } from 'react';
import InventoryTable from './InventoryTable.tsx';
import BorrowRecordsTable from './BorrowRecordsTable.tsx';
import UsersTable from './UsersTable.tsx';
import './AdminPanel.css';

type TabName = 'inventory' | 'borrows' | 'users';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<TabName>('inventory');

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage books, borrow records, and users</p>
      </div>

      {/* Tab navigation */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          Book Inventory
        </button>
        <button
          className={`admin-tab ${activeTab === 'borrows' ? 'active' : ''}`}
          onClick={() => setActiveTab('borrows')}
        >
          Borrow Records
        </button>
        <button
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      {/* Tab content */}
      <div className="admin-tab-content">
        {activeTab === 'inventory' && <InventoryTable />}
        {activeTab === 'borrows' && <BorrowRecordsTable />}
        {activeTab === 'users' && <UsersTable />}
      </div>
    </div>
  );
}
