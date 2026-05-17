"use client";

import { useState } from "react";
import { Upload, Button, message } from "antd";
import {
  UploadOutlined,
  LoadingOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { supabase } from "@/shared/api/supabase";
import styles from "./ImageUpload.module.css";

async function uploadToStorage(
  file: File,
  folder: string,
): Promise<string | null> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from("images")
    .upload(fileName, file, { upsert: true });
  if (error) {
    message.error("Ошибка загрузки: " + error.message);
    return null;
  }
  const { data } = supabase.storage.from("images").getPublicUrl(fileName);
  return data.publicUrl;
}

// Загрузка одного изображения — для фото категории и героя
interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  folder?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = "misc",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const url = await uploadToStorage(file, folder);
    if (url) onChange?.(url);
    setUploading(false);
  };

  return (
    <div className={styles.wrapper}>
      {value && (
        <div className={styles.preview}>
          <Image
            src={value}
            alt=""
            fill
            className={styles.previewImage}
            unoptimized
          />
        </div>
      )}
      <Upload
        accept="image/*"
        showUploadList={false}
        beforeUpload={(file) => {
          handleUpload(file);
          return false;
        }}
      >
        <Button
          icon={uploading ? <LoadingOutlined /> : <UploadOutlined />}
          disabled={uploading}
        >
          {uploading ? "Загрузка…" : value ? "Заменить фото" : "Загрузить фото"}
        </Button>
      </Upload>
    </div>
  );
}

// Загрузка нескольких изображений — для фото товара
interface MultiImageUploadProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  folder?: string;
}

export function MultiImageUpload({
  value = [],
  onChange,
  folder = "misc",
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const url = await uploadToStorage(file, folder);
    if (url) onChange?.([...value, url]);
    setUploading(false);
  };

  const remove = (url: string) => onChange?.(value.filter((u) => u !== url));

  return (
    <div className={styles.wrapper}>
      {value.length > 0 && (
        <div className={styles.gallery}>
          {value.map((url) => (
            <div key={url} className={styles.galleryItem}>
              <div className={styles.galleryItemInner}>
                <Image
                  src={url}
                  alt=""
                  fill
                  className={styles.galleryImage}
                  unoptimized
                />
              </div>
              <button
                type="button"
                onClick={() => remove(url)}
                className={styles.removeBtn}
              >
                <CloseOutlined />
              </button>
            </div>
          ))}
        </div>
      )}
      <Upload
        accept="image/*"
        showUploadList={false}
        beforeUpload={(file) => {
          handleUpload(file);
          return false;
        }}
      >
        <Button
          icon={uploading ? <LoadingOutlined /> : <UploadOutlined />}
          disabled={uploading}
        >
          {uploading ? "Загрузка…" : "Добавить фото"}
        </Button>
      </Upload>
    </div>
  );
}
