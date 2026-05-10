'use client';

import { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined, LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { supabase } from '@/shared/api/supabase';

async function uploadToStorage(file: File, folder: string): Promise<string | null> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('images').upload(fileName, file, { upsert: true });
  if (error) {
    message.error('Ошибка загрузки: ' + error.message);
    return null;
  }
  const { data } = supabase.storage.from('images').getPublicUrl(fileName);
  return data.publicUrl;
}

// Single image upload — for category photo and hero image
interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  folder?: string;
}

export function ImageUpload({ value, onChange, folder = 'misc' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const url = await uploadToStorage(file, folder);
    if (url) onChange?.(url);
    setUploading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {value && (
        <div style={{ position: 'relative', width: 140, height: 140, background: '#f2f2f2' }}>
          <Image src={value} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
        </div>
      )}
      <Upload
        accept="image/*"
        showUploadList={false}
        beforeUpload={(file) => { handleUpload(file); return false; }}
      >
        <Button icon={uploading ? <LoadingOutlined /> : <UploadOutlined />} disabled={uploading}>
          {uploading ? 'Загрузка…' : value ? 'Заменить фото' : 'Загрузить фото'}
        </Button>
      </Upload>
    </div>
  );
}

// Multiple images upload — for product photos
interface MultiImageUploadProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  folder?: string;
}

export function MultiImageUpload({ value = [], onChange, folder = 'misc' }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const url = await uploadToStorage(file, folder);
    if (url) onChange?.([...value, url]);
    setUploading(false);
  };

  const remove = (url: string) => onChange?.(value.filter((u) => u !== url));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {value.map((url) => (
            <div key={url} style={{ position: 'relative', width: 80, height: 100 }}>
              <div style={{ position: 'relative', width: 80, height: 100, background: '#f2f2f2' }}>
                <Image src={url} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
              </div>
              <button
                type="button"
                onClick={() => remove(url)}
                style={{
                  position: 'absolute', top: 2, right: 2,
                  background: 'rgba(0,0,0,0.6)', color: '#fff',
                  border: 'none', borderRadius: 2, cursor: 'pointer',
                  width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10,
                }}
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
        beforeUpload={(file) => { handleUpload(file); return false; }}
      >
        <Button icon={uploading ? <LoadingOutlined /> : <UploadOutlined />} disabled={uploading}>
          {uploading ? 'Загрузка…' : 'Добавить фото'}
        </Button>
      </Upload>
    </div>
  );
}
