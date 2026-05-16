"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import styles from "./page.module.css";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Вход в админку</h1>
        <form action={action} className={styles.form}>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            required
            autoFocus
          />
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Пароль"
            required
          />
          {state?.error && <p className={styles.error}>{state.error}</p>}
          <button className={styles.button} type="submit" disabled={pending}>
            {pending ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
