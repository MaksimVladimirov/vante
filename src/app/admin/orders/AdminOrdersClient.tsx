'use client';

import { useEffect, useState } from 'react';
import { Table, Tag, Select, message } from 'antd';
import { supabase } from '@/shared/api/supabase';
import type { Database } from '@/shared/api/database.types';
import styles from './page.module.css';

type Order = Database['public']['Tables']['orders']['Row'];

const STATUS_COLORS: Record<string, string> = {
  new: 'blue',
  paid: 'green',
  shipped: 'cyan',
  delivered: 'purple',
  cancelled: 'red',
};

export function AdminOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: Order['status']) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    message.success('Status updated');
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const columns = [
    {
      title: 'Order #',
      dataIndex: 'order_number',
      render: (v: string) => `#${v}`,
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      render: (v: string) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    },
    {
      title: 'Customer',
      dataIndex: 'customer_email',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      render: (v: number) => `$${v.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (v: Order['status'], record: Order) => (
        <Select
          value={v}
          size="small"
          onChange={(val) => updateStatus(record.id, val)}
          style={{ width: 120 }}
          options={(['new', 'paid', 'shipped', 'delivered', 'cancelled'] as const).map((s) => ({
            value: s,
            label: <Tag color={STATUS_COLORS[s]}>{s.charAt(0).toUpperCase() + s.slice(1)}</Tag>,
          }))}
        />
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Orders</h1>
      </div>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 20 }}
      />
    </div>
  );
}
