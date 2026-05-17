"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Divider,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import Image from "next/image";
import { supabase } from "@/shared/api/supabase";
import { ImageUpload } from "@/shared/ui/ImageUpload";
import type { Category } from "@/entities/product/model/types";
import styles from "../products/page.module.css";

export function AdminCategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const load = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("created_at");
    setCategories((data as Category[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    form.setFieldsValue({
      name: cat.name,
      name_en: cat.name_en ?? "",
      slug: cat.slug,
      image_url: cat.image_url ?? "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (values: {
    name: string;
    name_en: string;
    slug: string;
    image_url: string;
  }) => {
    const payload = {
      name: values.name,
      name_en: values.name_en || null,
      image_url: values.image_url || null,
    };

    if (editing) {
      await supabase
        .from("categories")
        .update({ ...payload, slug: values.slug })
        .eq("id", editing.id);
      message.success("Категория обновлена");
    } else {
      const slug =
        values.slug ||
        values.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/gi, "");
      const { error } = await supabase
        .from("categories")
        .insert([{ ...payload, slug }]);
      if (error) {
        message.error("Ошибка: " + error.message);
        return;
      }
      message.success("Категория добавлена");
    }
    setModalOpen(false);
    load();
  };

  const columns = [
    {
      title: "Фото",
      width: 80,
      render: (_: unknown, row: Category) => {
        const src = row.image_url || `/images/category-${row.slug}.jpg`;
        return (
          <div className={styles.thumbnailCategory}>
            <Image
              src={src}
              alt={row.name}
              fill
              className={styles.coverImage}
              unoptimized
            />
          </div>
        );
      },
    },
    { title: "RU", dataIndex: "name" },
    {
      title: "EN",
      dataIndex: "name_en",
      render: (v: string | null) =>
        v || <span className={styles.muted}>—</span>,
    },
    { title: "Slug", dataIndex: "slug" },
    {
      title: "",
      key: "action",
      render: (_: unknown, record: Category) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEdit(record)}
          />
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

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editing ? "Редактировать категорию" : "Добавить категорию"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText={editing ? "Сохранить" : "Создать"}
        cancelText="Отмена"
        forceRender
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

          <Divider>English</Divider>
          <Form.Item name="name_en" label="Name (EN)">
            <Input placeholder="e.g. Suits" />
          </Form.Item>

          <Divider />
          <Form.Item
            name="slug"
            label="Slug (URL, латиницей)"
            rules={editing ? [{ required: true }] : []}
            extra={
              !editing
                ? "Оставьте пустым — сгенерируется автоматически"
                : undefined
            }
          >
            <Input placeholder="suits" />
          </Form.Item>
          <Form.Item name="image_url" label="Фото категории">
            <ImageUpload folder="categories" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
