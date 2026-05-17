'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Button, message, Card, Divider } from 'antd';
import { supabase } from '@/shared/api/supabase';
import { ImageUpload } from '@/shared/ui/ImageUpload';
import styles from '../products/page.module.css';

type HeroValues = {
  hero_image_desktop: string;
  hero_image_tablet: string;
  hero_image_mobile: string;
  // RU
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_cta_link: string;
  // EN
  hero_eyebrow_en: string;
  hero_title_en: string;
  hero_subtitle_en: string;
  hero_cta_text_en: string;
};

export function AdminHeroClient() {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('site_settings').select('key, value');
      const map: Record<string, string> = {};
      data?.forEach((row) => { map[row.key] = row.value ?? ''; });
      form.setFieldsValue({
        hero_image_desktop: map.hero_image_desktop || map.hero_image || '/images/hero.jpg',
        hero_image_tablet:  map.hero_image_tablet  || map.hero_image || '/images/hero.jpg',
        hero_image_mobile:  map.hero_image_mobile  || map.hero_image || '/images/hero.jpg',
        hero_eyebrow:     map.hero_eyebrow     || 'Новая коллекция',
        hero_title:       map.hero_title       || 'Вне\nвремени',
        hero_subtitle:    map.hero_subtitle    || 'Создано для уверенности.',
        hero_cta_text:    map.hero_cta_text    || 'Смотреть коллекцию',
        hero_cta_link:    map.hero_cta_link    || '/suits',
        hero_eyebrow_en:  map.hero_eyebrow_en  || '',
        hero_title_en:    map.hero_title_en    || '',
        hero_subtitle_en: map.hero_subtitle_en || '',
        hero_cta_text_en: map.hero_cta_text_en || '',
      });
    };
    load();
  }, [form]);

  const handleSubmit = async (values: HeroValues) => {
    setSaving(true);
    for (const [key, value] of Object.entries(values)) {
      await supabase.from('site_settings').upsert({ key, value: value || null }, { onConflict: 'key' });
    }
    message.success('Настройки сохранены');
    setSaving(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Главная страница</h1>
      </div>

      <Card className={styles.card}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>

          <Divider>Фото под разрешение</Divider>
          <Form.Item name="hero_image_desktop" label="Десктоп (≥ 992px)">
            <ImageUpload folder="hero/desktop" />
          </Form.Item>
          <Form.Item name="hero_image_tablet" label="Планшет (768–991px)">
            <ImageUpload folder="hero/tablet" />
          </Form.Item>
          <Form.Item name="hero_image_mobile" label="Мобильный (< 768px)">
            <ImageUpload folder="hero/mobile" />
          </Form.Item>

          <Divider>Текст — Русский</Divider>
          <Form.Item name="hero_eyebrow" label="Надпись над заголовком (RU)">
            <Input placeholder="Новая коллекция" />
          </Form.Item>
          <Form.Item name="hero_title" label="Заголовок (RU) — перенос строки = новая строка">
            <Input.TextArea rows={2} placeholder={'Вне\nвремени'} />
          </Form.Item>
          <Form.Item name="hero_subtitle" label="Подзаголовок (RU)">
            <Input placeholder="Создано для уверенности." />
          </Form.Item>
          <Form.Item name="hero_cta_text" label="Текст кнопки (RU)">
            <Input placeholder="Смотреть коллекцию" />
          </Form.Item>
          <Form.Item name="hero_cta_link" label="Ссылка кнопки">
            <Input placeholder="/suits" />
          </Form.Item>

          <Divider>Text — English</Divider>
          <Form.Item name="hero_eyebrow_en" label="Eyebrow (EN)">
            <Input placeholder="New Collection" />
          </Form.Item>
          <Form.Item name="hero_title_en" label="Title (EN) — line break = new line">
            <Input.TextArea rows={2} placeholder={'Beyond\nTime'} />
          </Form.Item>
          <Form.Item name="hero_subtitle_en" label="Subtitle (EN)">
            <Input placeholder="Made for confidence." />
          </Form.Item>
          <Form.Item name="hero_cta_text_en" label="Button text (EN)">
            <Input placeholder="View Collection" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={saving}>
            Сохранить
          </Button>
        </Form>
      </Card>
    </div>
  );
}
