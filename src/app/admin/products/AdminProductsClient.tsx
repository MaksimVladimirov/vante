"use client";

import { useEffect, useState } from "react";
import {
  Table, Button, Tag, Space, Modal, Form, Input,
  InputNumber, Select, message, Divider,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Image from "next/image";
import { supabase } from "@/shared/api/supabase";
import { MultiImageUpload } from "@/shared/ui/ImageUpload";
import type { Product, Category } from "@/entities/product/model/types";
import styles from "./page.module.css";

const COLOR_OPTIONS = [
  { value: "Black",    label: "Чёрный" },
  { value: "Navy",     label: "Тёмно-синий" },
  { value: "Grey",     label: "Серый" },
  { value: "White",    label: "Белый" },
  { value: "Charcoal", label: "Тёмно-серый" },
  { value: "Brown",    label: "Коричневый" },
  { value: "Beige",    label: "Бежевый" },
  { value: "Olive",    label: "Оливковый" },
];

const SIZES = ['46 (S)', '48 (M)', '50 (L)', '52 (XL)'];

export function AdminProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const selectedSizes: string[] = Form.useWatch('sizes', form) ?? [];

  const load = async () => {
    setLoading(true);
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from("products").select("*, category:categories(*)").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
    ]);
    setProducts((prods as Product[]) ?? []);
    setCategories((cats as Category[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    form.setFieldsValue({ ...product, size_stock: product.size_stock ?? {} });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Удалить товар?",
      content: "Это действие нельзя отменить.",
      okText: "Удалить",
      cancelText: "Отмена",
      okButtonProps: { danger: true },
      onOk: async () => {
        await supabase.from("products").delete().eq("id", id);
        message.success("Товар удалён");
        load();
      },
    });
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    const sizeStock = (values.size_stock as Record<string, number>) ?? {};
    const totalStock = Object.values(sizeStock).reduce((s, n) => s + (Number(n) || 0), 0);
    const slug = String(values.name).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/gi, "");

    const payload = {
      name:           String(values.name),
      name_en:        (values.name_en as string) || null,
      description:    (values.description as string) || null,
      description_en: (values.description_en as string) || null,
      details:        (values.details as string) || null,
      details_en:     (values.details_en as string) || null,
      price:          Number(values.price),
      category_id:    String(values.category_id),
      colors:         (values.colors as string[]) ?? [],
      sizes:          (values.sizes as string[]) ?? [],
      size_stock:     sizeStock,
      stock:          totalStock,
      status:         (values.status as "active" | "inactive") ?? "active",
      images:         (values.images as string[]) ?? [],
    };

    if (editing) {
      await supabase.from("products").update(payload).eq("id", editing.id);
      message.success("Товар обновлён");
    } else {
      await supabase.from("products").insert([{ ...payload, slug }]);
      message.success("Товар создан");
    }
    setModalOpen(false);
    load();
  };

  const columns = [
    {
      title: "Фото", dataIndex: "images", width: 70,
      render: (images: string[]) => images?.[0] ? (
        <div style={{ position: "relative", width: 48, height: 60 }}>
          <Image src={images[0]} alt="" fill style={{ objectFit: "cover" }} unoptimized />
        </div>
      ) : <div style={{ width: 48, height: 60, background: "#f2f2f2" }} />,
    },
    { title: "RU", dataIndex: "name" },
    { title: "EN", dataIndex: "name_en", render: (v: string | null) => v || <span style={{ color: '#bbb' }}>—</span> },
    { title: "Категория", render: (_: unknown, r: Product) => r.category?.name ?? "—" },
    { title: "Цена", dataIndex: "price", render: (v: number) => `${v.toLocaleString("ru-RU")} ₽` },
    { title: "Остаток", dataIndex: "stock" },
    {
      title: "Статус", dataIndex: "status",
      render: (v: string) => <Tag color={v === "active" ? "green" : "default"}>{v === "active" ? "Активен" : "Неактивен"}</Tag>,
    },
    {
      title: "", key: "action",
      render: (_: unknown, record: Product) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Товары</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Добавить товар</Button>
      </div>

      <Table columns={columns} dataSource={products} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />

      <Modal
        title={editing ? "Редактировать товар" : "Добавить товар"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        width={680}
        okText={editing ? "Сохранить" : "Создать"}
        cancelText="Отмена"
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Divider>Русский</Divider>
          <Form.Item name="name" label="Название (RU)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Описание (RU)">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="details" label="Детали (RU)">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Divider>English</Divider>
          <Form.Item name="name_en" label="Name (EN)">
            <Input placeholder="e.g. Milano Suit" />
          </Form.Item>
          <Form.Item name="description_en" label="Description (EN)">
            <Input.TextArea rows={2} placeholder="e.g. Double-breasted suit in Italian wool" />
          </Form.Item>
          <Form.Item name="details_en" label="Details (EN)">
            <Input.TextArea rows={2} placeholder="e.g. Dry clean only. Made in Italy." />
          </Form.Item>

          <Divider />
          <Form.Item name="price" label="Цена (₽)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="category_id" label="Категория" rules={[{ required: true }]}>
            <Select options={categories.map((c) => ({ value: c.id, label: c.name }))} />
          </Form.Item>
          <Form.Item name="colors" label="Цвета">
            <Select mode="multiple" options={COLOR_OPTIONS} />
          </Form.Item>
          <Form.Item name="sizes" label="Размеры">
            <Select mode="multiple" options={SIZES.map((s) => ({ value: s, label: s }))} />
          </Form.Item>

          {selectedSizes.length > 0 && (
            <Form.Item label="Остаток по размерам">
              {selectedSizes.map((size) => (
                <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 70, fontWeight: 500 }}>{size}</span>
                  <Form.Item name={['size_stock', size]} noStyle>
                    <InputNumber min={0} defaultValue={0} style={{ width: 100 }} />
                  </Form.Item>
                  <span style={{ color: '#888' }}>шт.</span>
                </div>
              ))}
            </Form.Item>
          )}

          <Form.Item name="status" label="Статус" initialValue="active">
            <Select options={[{ value: "active", label: "Активен" }, { value: "inactive", label: "Неактивен" }]} />
          </Form.Item>
          <Form.Item name="images" label="Фотографии товара">
            <MultiImageUpload folder="products" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
