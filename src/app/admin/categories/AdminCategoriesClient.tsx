'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { supabase } from '@/shared/api/supabase';
import { ImageUpload } from '@/shared/ui/ImageUpload';
import type { Category } from '@/entities/product/model/types';
import styles from '../products/page.module.css';

export function AdminCategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('created_at');
    setCategories((data as Category[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    form.setFieldsValue({ name: cat.name, slug: cat.slug, image_url: cat.image_url ?? '' });
    setModalOpen(true);
  };

  const handleSubmit = async (values: { name: string; slug: string; image_url: string }) => {
    if (editing) {
      await supabase.from('categories').update({
        name: values.name,
        slug: values.slug,
        image_url: values.image_url || null,
      }).eq('id', editing.id);
      message.success('Категория обновлена');
    } else {
      const slug = values.slug || values.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '');
      const { error } = await supabase.from('categories').insert([{
        name: values.name,
        slug,
        image_url: values.image_url || null,
      }]);
      if (error) {
        message.error('Ошибка: ' + error.message);
        return;
      }
      message.success('Категория добавлена');
    }
    setModalOpen(false);
    load();
  };

  const columns = [
    {
      title: 'Фото',
      width: 80,
      render: (_: unknown, row: Category) => {
        const src = row.image_url || `/images/category-${row.slug}.jpg`;
        return (
          <div style={{ position: 'relative', width: 60, height: 60, background: '#f2f2f2' }}>
            <Image src={src} alt={row.name} fill style={{ objectFit: 'cover' }} unoptimized />
          </div>
        );
      },
    },
    { title: 'Название', dataIndex: 'name' },
    { title: 'Slug', dataIndex: 'slug' },
    {
      title: 'URL фото',
      dataIndex: 'image_url',
      render: (v: string | null) =>
        v ? (
          <span style={{ fontSize: 12, color: '#666' }}>{v.length > 50 ? v.slice(0, 50) + '…' : v}</span>
        ) : (
          <span style={{ color: '#bbb' }}>не задано</span>
        ),
    },
    {
      title: '',
      key: 'action',
      render: (_: unknown, record: Category) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Категории</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Добавить категорию
        </Button>
      </div>

      <Table columns={columns} dataSource={categories} rowKey="id" loading={loading} pagination={false} />

      <Modal
        title={editing ? 'Редактировать категорию' : 'Добавить категорию'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText={editing ? 'Сохранить' : 'Создать'}
        cancelText="Отмена"
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Название" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="slug"
            label="Slug (URL, латиницей)"
            rules={editing ? [{ required: true }] : []}
            extra={!editing ? 'Оставьте пустым — сгенерируется автоматически из названия' : undefined}
          >
            <Input placeholder="например: suits" />
          </Form.Item>
          <Form.Item name="image_url" label="Фото категории">
            <ImageUpload folder="categories" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
