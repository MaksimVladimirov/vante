export const dynamic = "force-dynamic";

import { supabase } from "@/shared/api/supabase";
import { Card, Statistic, Row, Col } from "antd";
import {
  ShoppingOutlined,
  TagsOutlined,
  DollarOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import styles from "./page.module.css";

async function getStats() {
  const [{ count: products }, { count: orders }, { data: revenue }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase
        .from("orders")
        .select("total")
        .in("status", ["paid", "shipped", "delivered"]),
    ]);

  const totalRevenue =
    revenue?.reduce((acc, o) => acc + (o.total || 0), 0) ?? 0;
  return { products: products ?? 0, orders: orders ?? 0, totalRevenue };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Дашборд</h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Товаров"
              value={stats.products}
              prefix={<TagsOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Заказов"
              value={stats.orders}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Выручка"
              value={`${stats.totalRevenue.toLocaleString("ru-RU")} ₽`}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="В наличии"
              value={stats.products}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
