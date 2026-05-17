"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  App,
  Divider,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Image from "next/image";
import { supabase } from "@/shared/api/supabase";
import { MultiImageUpload } from "@/shared/ui/ImageUpload";
import { ColorSelector } from "@/shared/ui/ColorSelector";
import type { Product, Category } from "@/entities/product/model/types";
import styles from "./page.module.css";

const SIZES = ["46 (S)", "48 (M)", "50 (L)", "52 (XL)"];

export function AdminProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const load = async () => {
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase
        .from("products")
        .select("*, category:categories(*)")
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
    ]);
    setProducts((prods as Product[]) ?? []);
    setCategories((cats as Category[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const [{ data: prods }, { data: cats }] = await Promise.all([
        supabase
          .from("products")
          .select("*, category:categories(*)")
          .order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("name"),
      ]);
      setProducts((prods as Product[]) ?? []);
      setCategories((cats as Category[]) ?? []);
      setLoading(false);
    };
    init();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setSelectedSizes([]);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    const sizes = product.sizes ?? [];
    setSelectedSizes(sizes);
    const sizeStock: Record<string, number> = {};
    sizes.forEach((size) => {
      sizeStock[size] = product.size_stock?.[size] ?? 0;
    });
    form.setFieldsValue({ ...product, size_stock: sizeStock });
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
    const totalStock = Object.values(sizeStock).reduce(
      (acc, n) => acc + (Number(n) || 0),
      0,
    );
    const generateSlug = (name: string) => {
      const base = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/gi, "");
      return base || `product-${Date.now()}`;
    };
    // При редактировании slug не меняем; при создании берём из EN-названия или RU
    const slug = editing
      ? editing.slug
      : generateSlug((values.name_en as string) || String(values.name));

    const payload = {
      name: String(values.name),
      name_en: (values.name_en as string) || null,
      description: (values.description as string) || null,
      description_en: (values.description_en as string) || null,
      details: (values.details as string) || null,
      details_en: (values.details_en as string) || null,
      price: Number(values.price),
      category_id: String(values.category_id),
      colors: (values.colors as string[]) ?? [],
      sizes: (values.sizes as string[]) ?? [],
      size_stock: sizeStock,
      stock: totalStock,
      status: (values.status as "active" | "inactive") ?? "active",
      images: (values.images as string[]) ?? [],
    };

    if (editing) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editing.id);
      if (error) {
        message.error("Ошибка: " + error.message);
        return;
      }
      message.success("Товар обновлён");
    } else {
      const { error } = await supabase
        .from("products")
        .insert([{ ...payload, slug }]);
      if (error) {
        message.error("Ошибка: " + error.message);
        return;
      }
      message.success("Товар создан");
    }
    setModalOpen(false);
    load();
  };

  const columns = [
    {
      title: "Фото",
      dataIndex: "images",
      width: 70,
      render: (images: string[]) =>
        images?.[0] ? (
          <div className={styles.thumbnail}>
            <Image
              src={images[0]}
              alt=""
              fill
              className={styles.coverImage}
              unoptimized
            />
          </div>
        ) : (
          <div className={styles.thumbnailEmpty} />
        ),
    },
    { title: "RU", dataIndex: "name" },
    {
      title: "EN",
      dataIndex: "name_en",
      render: (v: string | null) =>
        v || <span className={styles.muted}>—</span>,
    },
    {
      title: "Категория",
      render: (_: unknown, r: Product) => r.category?.name ?? "—",
    },
    {
      title: "Цена",
      dataIndex: "price",
      render: (v: number) => `${v.toLocaleString("ru-RU")} ₽`,
    },
    { title: "Остаток", dataIndex: "stock" },
    {
      title: "Статус",
      dataIndex: "status",
      render: (v: string) => (
        <Tag color={v === "active" ? "green" : "default"}>
          {v === "active" ? "Активен" : "Неактивен"}
        </Tag>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_: unknown, record: Product) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEdit(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Товары</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Добавить товар
        </Button>
      </div>

      <div className={styles.toolbar}>
        <Select
          allowClear
          placeholder="Все категории"
          style={{ width: 200 }}
          value={categoryFilter}
          onChange={(val) => setCategoryFilter(val ?? null)}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
      </div>

      <Table
        columns={columns}
        dataSource={
          categoryFilter
            ? products.filter((p) => p.category_id === categoryFilter)
            : products
        }
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 20 }}
      />

      <Modal
        title={editing ? "Редактировать товар" : "Добавить товар"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        width={680}
        okText={editing ? "Сохранить" : "Создать"}
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Divider>Русский</Divider>
          <Form.Item
            name="name"
            label="Название (RU)"
            rules={[{ required: true }]}
          >
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
            <Input.TextArea
              rows={2}
              placeholder="e.g. Double-breasted suit in Italian wool"
            />
          </Form.Item>
          <Form.Item name="details_en" label="Details (EN)">
            <Input.TextArea
              rows={2}
              placeholder="e.g. Dry clean only. Made in Italy."
            />
          </Form.Item>

          <Divider />
          <Form.Item name="price" label="Цена (₽)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="category_id"
            label="Категория"
            rules={[{ required: true }]}
          >
            <Select
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
          </Form.Item>
          <Form.Item name="colors" label="Цвета">
            <ColorSelector />
          </Form.Item>
          <Form.Item name="sizes" label="Размеры">
            <Select
              mode="multiple"
              options={SIZES.map((size) => ({ value: size, label: size }))}
              onChange={(val: string[]) => setSelectedSizes(val)}
            />
          </Form.Item>

          {selectedSizes.length > 0 && (
            <Form.Item label="Остаток по размерам">
              {selectedSizes.map((size) => (
                <div key={size} className={styles.sizeStockRow}>
                  <span className={styles.sizeStockLabel}>{size}</span>
                  <Form.Item
                    name={["size_stock", size]}
                    noStyle
                    initialValue={0}
                  >
                    <InputNumber min={0} style={{ width: 100 }} />
                  </Form.Item>
                  <span className={styles.sizeStockUnit}>шт.</span>
                </div>
              ))}
            </Form.Item>
          )}

          <Form.Item name="status" label="Статус" initialValue="active">
            <Select
              options={[
                { value: "active", label: "Активен" },
                { value: "inactive", label: "Неактивен" },
              ]}
            />
          </Form.Item>
          <Form.Item name="images" label="Фотографии товара">
            <MultiImageUpload folder="products" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
