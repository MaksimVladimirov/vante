-- Add English-language columns for i18n support
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_en text;

ALTER TABLE products ADD COLUMN IF NOT EXISTS name_en       text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_en text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS details_en    text;

-- Hero English site_settings (key-value, no migration needed — inserted on first admin save)
-- Keys: hero_eyebrow_en, hero_title_en, hero_subtitle_en, hero_cta_text_en, hero_cta_link_en
