"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLang } from "@/shared/i18n/LangContext";
import styles from "./BackButton.module.css";

export function BackButton() {
  const router = useRouter();
  const { dict } = useLang();

  return (
    <button className={styles.btn} onClick={() => router.back()}>
      <ArrowLeftOutlined />
      {dict.nav.back}
    </button>
  );
}
