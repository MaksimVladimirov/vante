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
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_cta_link: string;
};

const DEFAULTS: HeroValues = {
  hero_image_desktop: '/images/hero.jpg',
  hero_image_tablet: '/images/hero.jpg',
  hero_image_mobile: '/images/hero.jpg',
  hero_eyebrow: 'Новая коллекция',
  hero_title: 'Вне\nвремени',
  hero_subtitle: 'Создано для уверенности.',
  hero_cta_text: 'Смотреть коллекцию',
  hero_cta_link: '/suits',
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
        hero_image_desktop: map.hero_image_desktop || map.hero_image || DEFAULTS.hero_image_desktop,
        hero_image_tablet:  map.hero_image_tablet  || map.hero_image || DEFAULTS.hero_image_tablet,
        hero_image_mobile:  map.hero_image_mobile  || map.hero_image || DEFAULTS.hero_image_mobile,
        hero_eyebrow:  map.hero_eyebrow  || DEFAULTS.hero_eyebrow,
        hero_title:    map.hero_title    || DEFAULTS.hero_title,
        hero_subtitle: map.hero_subtitle || DEFAULTS.hero_subtitle,
        hero_cta_text: map.hero_cta_text || DEFAULTS.hero_cta_text,
        hero_cta_link: map.hero_cta_link || DEFAULTS.hero_cta_link,
      });
    };
    load();
  }, [form]);

  const handleSubmit = async (values: HeroValues) => {
    setSaving(true);
    for (const [key, value] of Object.entries(values)) {
      await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' });
    }
    message.success('Настройки сохранены');
    setSaving(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Главная страница</h1>
      </div>

      <Card style={{ maxWidth: 680 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>

          <Divider style={{ fontSize: 13 }}>Фото под разрешение</Divider>

          <Form.Item
            name="hero_image_desktop"
            label="Десктоп (≥ 992px) — широкое горизонтальное фото"
          >
            <ImageUpload folder="hero/desktop" />
          </Form.Item>

          <Form.Item
            name="hero_image_tablet"
            label="Планшет (768–991px) — вертикальное или квадратное"
          >
            <ImageUpload folder="hero/tablet" />
          </Form.Item>

          <Form.Item
            name="hero_image_mobile"
            label="Мобильный (< 768px) — вертикальное фото"
          >
            <ImageUpload folder="hero/mobile" />
          </Form.Item>

          <Divider style={{ fontSize: 13 }}>Текст</Divider>

          <Form.Item name="hero_eyebrow" label="Надпись над заголовком">
            <Input placeholder="Новая коллекция" />
          </Form.Item>
          <Form.Item name="hero_title" label="Заголовок (перенос строки — новая строка)">
            <Input.TextArea rows={2} placeholder={'Вне\nвремени'} />
          </Form.Item>
          <Form.Item name="hero_subtitle" label="Подзаголовок">
            <Input placeholder="Создано для уверенности." />
          </Form.Item>

          <Divider style={{ fontSize: 13 }}>Кнопка</Divider>

          <Form.Item name="hero_cta_text" label="Текст кнопки">
            <Input placeholder="Смотреть коллекцию" />
          </Form.Item>
          <Form.Item name="hero_cta_link" label="Ссылка кнопки">
            <Input placeholder="/suits" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={saving}>
            Сохранить
          </Button>
        </Form>
      </Card>
    </div>
  );
}
