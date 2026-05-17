'use client'

import { useState } from 'react'
import { ColorPicker, Button } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import type { Color } from 'antd/es/color-picker'
import styles from './ColorSelector.module.css'

interface Props {
  value?: string[]
  onChange?: (colors: string[]) => void
}

export function ColorSelector({ value = [], onChange }: Props) {
  const [draft, setDraft] = useState('#000000')

  const handlePickerChange = (color: Color) => {
    setDraft(color.toHexString())
  }

  const addColor = () => {
    const hex = draft.toLowerCase()
    if (!value.includes(hex)) {
      onChange?.([...value, hex])
    }
  }

  const removeColor = (hex: string) => {
    onChange?.(value.filter((c) => c !== hex))
  }

  return (
    <div className={styles.wrapper}>
      {value.length > 0 && (
        <div className={styles.swatches}>
          {value.map((hex) => (
            <div key={hex} className={styles.swatch}>
              <span className={styles.swatchColor} style={{ backgroundColor: hex }} />
              <span className={styles.swatchHex}>{hex}</span>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeColor(hex)}
              >
                <CloseOutlined />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className={styles.addRow}>
        <ColorPicker value={draft} onChange={handlePickerChange} showText={false} />
        <Button size="small" onClick={addColor}>Добавить цвет</Button>
      </div>
    </div>
  )
}
