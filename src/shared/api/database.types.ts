export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          image_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          details: string | null;
          price: number;
          category_id: string;
          images: string[];
          colors: string[];
          sizes: string[];
          size_stock: Record<string, number>;
          stock: number;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          details?: string | null;
          price: number;
          category_id: string;
          images?: string[];
          colors?: string[];
          sizes?: string[];
          size_stock?: Record<string, number>;
          stock?: number;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          details?: string | null;
          price?: number;
          category_id?: string;
          images?: string[];
          colors?: string[];
          sizes?: string[];
          size_stock?: Record<string, number>;
          stock?: number;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_email: string;
          customer_name: string | null;
          items: Json;
          subtotal: number;
          shipping: number;
          total: number;
          status: 'new' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          customer_email: string;
          customer_name?: string | null;
          items: Json;
          subtotal: number;
          shipping?: number;
          total: number;
          status?: 'new' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_email?: string;
          customer_name?: string | null;
          items?: Json;
          subtotal?: number;
          shipping?: number;
          total?: number;
          status?: 'new' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: string | null;
        };
        Insert: {
          key: string;
          value?: string | null;
        };
        Update: {
          key?: string;
          value?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
