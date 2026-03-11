export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          count: number
          created_at: string
          description: string
          id: string
          image: string
          name: string
          slug: string
        }
        Insert: {
          count?: number
          created_at?: string
          description?: string
          id?: string
          image?: string
          name: string
          slug: string
        }
        Update: {
          count?: number
          created_at?: string
          description?: string
          id?: string
          image?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      checkout_leads: {
        Row: {
          address: string
          created_at: string
          customer_name: string
          customer_phone: string
          id: string
          items: Json
          items_count: number
          status: string
          total: number
        }
        Insert: {
          address?: string
          created_at?: string
          customer_name?: string
          customer_phone?: string
          id: string
          items?: Json
          items_count?: number
          status?: string
          total?: number
        }
        Update: {
          address?: string
          created_at?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          items?: Json
          items_count?: number
          status?: string
          total?: number
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          description: string
          expires_at: string | null
          id: string
          max_uses: number | null
          min_order: number
          type: string
          used_count: number
          value: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          description?: string
          expires_at?: string | null
          id: string
          max_uses?: number | null
          min_order?: number
          type?: string
          used_count?: number
          value?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          min_order?: number
          type?: string
          used_count?: number
          value?: number
        }
        Relationships: []
      }
      courier_settings: {
        Row: {
          api_base_url: string
          api_key: string
          api_secret: string
          created_at: string
          default_weight: number
          enable_cod: boolean
          enabled: boolean
          id: string
          merchant_id: string
          pickup_address: string
          pickup_phone: string
          show_tracking: boolean
        }
        Insert: {
          api_base_url?: string
          api_key?: string
          api_secret?: string
          created_at?: string
          default_weight?: number
          enable_cod?: boolean
          enabled?: boolean
          id?: string
          merchant_id?: string
          pickup_address?: string
          pickup_phone?: string
          show_tracking?: boolean
        }
        Update: {
          api_base_url?: string
          api_key?: string
          api_secret?: string
          created_at?: string
          default_weight?: number
          enable_cod?: boolean
          enabled?: boolean
          id?: string
          merchant_id?: string
          pickup_address?: string
          pickup_phone?: string
          show_tracking?: boolean
        }
        Relationships: []
      }
      homepage_sections: {
        Row: {
          active: boolean
          content: Json
          created_at: string
          id: string
          layout: string
          section_type: string
          sort_order: number
          subtitle: string
          title: string
        }
        Insert: {
          active?: boolean
          content?: Json
          created_at?: string
          id: string
          layout?: string
          section_type: string
          sort_order?: number
          subtitle?: string
          title?: string
        }
        Update: {
          active?: boolean
          content?: Json
          created_at?: string
          id?: string
          layout?: string
          section_type?: string
          sort_order?: number
          subtitle?: string
          title?: string
        }
        Relationships: []
      }
      landing_pages: {
        Row: {
          active: boolean
          cards: Json
          created_at: string
          cta_text: string
          hero_image: string
          hero_subtitle: string
          hero_title: string
          id: string
          product_ids: string[]
          slug: string
          title: string
        }
        Insert: {
          active?: boolean
          cards?: Json
          created_at?: string
          cta_text?: string
          hero_image?: string
          hero_subtitle?: string
          hero_title?: string
          id?: string
          product_ids?: string[]
          slug: string
          title: string
        }
        Update: {
          active?: boolean
          cards?: Json
          created_at?: string
          cta_text?: string
          hero_image?: string
          hero_subtitle?: string
          hero_title?: string
          id?: string
          product_ids?: string[]
          slug?: string
          title?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          image: string
          name: string
          order_id: string
          price: number
          product_id: string
          quantity: number
          variant_id: string
          variant_label: string
        }
        Insert: {
          id?: string
          image?: string
          name?: string
          order_id: string
          price?: number
          product_id?: string
          quantity?: number
          variant_id?: string
          variant_label?: string
        }
        Update: {
          id?: string
          image?: string
          name?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
          variant_id?: string
          variant_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          created_at: string
          date: string
          id: string
          note: string | null
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          note?: string | null
          order_id: string
          status?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          note?: string | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: Json
          cod_fee: number
          coupon_code: string | null
          courier_name: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          discount: number
          id: string
          payment_method: string
          shipping_cost: number
          shipping_method: string
          status: string
          subtotal: number
          total: number
          tracking_number: string | null
          transaction_id: string | null
        }
        Insert: {
          address?: Json
          cod_fee?: number
          coupon_code?: string | null
          courier_name?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          discount?: number
          id: string
          payment_method?: string
          shipping_cost?: number
          shipping_method?: string
          status?: string
          subtotal?: number
          total?: number
          tracking_number?: string | null
          transaction_id?: string | null
        }
        Update: {
          address?: Json
          cod_fee?: number
          coupon_code?: string | null
          courier_name?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          discount?: number
          id?: string
          payment_method?: string
          shipping_cost?: number
          shipping_method?: string
          status?: string
          subtotal?: number
          total?: number
          tracking_number?: string | null
          transaction_id?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          code: string
          created_at: string
          description: string
          enabled: boolean
          id: string
          instructions: string
          name: string
          partial_delivery: boolean
          require_transaction_id: boolean
          sort_order: number
        }
        Insert: {
          code?: string
          created_at?: string
          description?: string
          enabled?: boolean
          id: string
          instructions?: string
          name: string
          partial_delivery?: boolean
          require_transaction_id?: boolean
          sort_order?: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          enabled?: boolean
          id?: string
          instructions?: string
          name?: string
          partial_delivery?: boolean
          require_transaction_id?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          approved: boolean
          author: string
          comment: string
          created_at: string
          date: string
          id: string
          product_id: string
          rating: number
          verified: boolean
        }
        Insert: {
          approved?: boolean
          author?: string
          comment?: string
          created_at?: string
          date?: string
          id?: string
          product_id: string
          rating?: number
          verified?: boolean
        }
        Update: {
          approved?: boolean
          author?: string
          comment?: string
          created_at?: string
          date?: string
          id?: string
          product_id?: string
          rating?: number
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string
          id: string
          label: string
          old_price: number | null
          price: number
          product_id: string
          sku: string
          stock: number
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string
          old_price?: number | null
          price?: number
          product_id: string
          sku?: string
          stock?: number
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          old_price?: number | null
          price?: number
          product_id?: string
          sku?: string
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          badge: string | null
          benefits: string[]
          brand: string
          category: string
          created_at: string
          description: string
          faq: Json
          id: string
          images: string[]
          ingredients: string
          meta_desc: string
          meta_title: string
          name: string
          rating: number
          related_ids: string[]
          review_count: number
          short_desc: string
          slug: string
          subcategory: string | null
          tags: string[]
          usage_info: string
        }
        Insert: {
          badge?: string | null
          benefits?: string[]
          brand?: string
          category?: string
          created_at?: string
          description?: string
          faq?: Json
          id?: string
          images?: string[]
          ingredients?: string
          meta_desc?: string
          meta_title?: string
          name: string
          rating?: number
          related_ids?: string[]
          review_count?: number
          short_desc?: string
          slug: string
          subcategory?: string | null
          tags?: string[]
          usage_info?: string
        }
        Update: {
          badge?: string | null
          benefits?: string[]
          brand?: string
          category?: string
          created_at?: string
          description?: string
          faq?: Json
          id?: string
          images?: string[]
          ingredients?: string
          meta_desc?: string
          meta_title?: string
          name?: string
          rating?: number
          related_ids?: string[]
          review_count?: number
          short_desc?: string
          slug?: string
          subcategory?: string | null
          tags?: string[]
          usage_info?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string
          avatar_url: string
          created_at: string
          full_name: string
          id: string
          phone: string
          updated_at: string
        }
        Insert: {
          address?: string
          avatar_url?: string
          created_at?: string
          full_name?: string
          id: string
          phone?: string
          updated_at?: string
        }
        Update: {
          address?: string
          avatar_url?: string
          created_at?: string
          full_name?: string
          id?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      shipping_methods: {
        Row: {
          active: boolean
          base_rate: number
          created_at: string
          description: string
          estimated_days: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          base_rate?: number
          created_at?: string
          description?: string
          estimated_days?: string
          id: string
          name: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          base_rate?: number
          created_at?: string
          description?: string
          estimated_days?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      shipping_zones: {
        Row: {
          active: boolean
          cities: string
          created_at: string
          delivery_time: string
          id: string
          name: string
          rate: number
          sort_order: number
        }
        Insert: {
          active?: boolean
          cities?: string
          created_at?: string
          delivery_time?: string
          id: string
          name: string
          rate?: number
          sort_order?: number
        }
        Update: {
          active?: boolean
          cities?: string
          created_at?: string
          delivery_time?: string
          id?: string
          name?: string
          rate?: number
          sort_order?: number
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          created_at?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      sliders: {
        Row: {
          active: boolean
          created_at: string
          cta_link: string
          cta_text: string
          heading: string
          id: string
          image_url: string
          sort_order: number
          text: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          cta_link?: string
          cta_text?: string
          heading?: string
          id: string
          image_url?: string
          sort_order?: number
          text?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          cta_link?: string
          cta_text?: string
          heading?: string
          id?: string
          image_url?: string
          sort_order?: number
          text?: string
        }
        Relationships: []
      }
      staff_users: {
        Row: {
          active: boolean
          created_at: string
          email: string
          id: string
          name: string
          password: string
          role: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          email: string
          id?: string
          name?: string
          password: string
          role?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string
          password?: string
          role?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
