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
      aulas: {
        Row: {
          categoria_id: string
          conteudo: string | null
          criado_em: string
          id: string
          ordem: number
          status: string
          tempo_leitura: string | null
          titulo: string
        }
        Insert: {
          categoria_id: string
          conteudo?: string | null
          criado_em?: string
          id?: string
          ordem?: number
          status?: string
          tempo_leitura?: string | null
          titulo: string
        }
        Update: {
          categoria_id?: string
          conteudo?: string | null
          criado_em?: string
          id?: string
          ordem?: number
          status?: string
          tempo_leitura?: string | null
          titulo?: string
        }
        Relationships: []
      }
      categorias: {
        Row: {
          criado_em: string
          descricao: string | null
          emoji: string | null
          id: string
          nome: string
          ordem: number
        }
        Insert: {
          criado_em?: string
          descricao?: string | null
          emoji?: string | null
          id?: string
          nome: string
          ordem?: number
        }
        Update: {
          criado_em?: string
          descricao?: string | null
          emoji?: string | null
          id?: string
          nome?: string
          ordem?: number
        }
        Relationships: []
      }
      provinhas: {
        Row: {
          criado_em: string
          descricao: string | null
          id: string
          status: string
          titulo: string
        }
        Insert: {
          criado_em?: string
          descricao?: string | null
          id?: string
          status?: string
          titulo: string
        }
        Update: {
          criado_em?: string
          descricao?: string | null
          id?: string
          status?: string
          titulo?: string
        }
        Relationships: []
      }
      provinhas_questoes: {
        Row: {
          alternativa_a: string
          alternativa_b: string
          alternativa_c: string
          alternativa_correta: string
          alternativa_d: string
          enunciado: string
          explicacao: string | null
          id: string
          ordem: number
          provinha_id: string
        }
        Insert: {
          alternativa_a: string
          alternativa_b: string
          alternativa_c: string
          alternativa_correta: string
          alternativa_d: string
          enunciado: string
          explicacao?: string | null
          id?: string
          ordem?: number
          provinha_id: string
        }
        Update: {
          alternativa_a?: string
          alternativa_b?: string
          alternativa_c?: string
          alternativa_correta?: string
          alternativa_d?: string
          enunciado?: string
          explicacao?: string | null
          id?: string
          ordem?: number
          provinha_id?: string
        }
        Relationships: []
      }
      provinhas_resultados: {
        Row: {
          acertos: number
          criado_em: string
          id: string
          percentual: number
          provinha_id: string
          token_aluno: string
          total: number
        }
        Insert: {
          acertos?: number
          criado_em?: string
          id?: string
          percentual?: number
          provinha_id: string
          token_aluno: string
          total?: number
        }
        Update: {
          acertos?: number
          criado_em?: string
          id?: string
          percentual?: number
          provinha_id?: string
          token_aluno?: string
          total?: number
        }
        Relationships: []
      }
      questoes: {
        Row: {
          alternativa_a: string
          alternativa_b: string
          alternativa_c: string
          alternativa_correta: string
          alternativa_d: string
          categoria_id: string
          criado_em: string
          enunciado: string
          explicacao: string | null
          id: string
        }
        Insert: {
          alternativa_a: string
          alternativa_b: string
          alternativa_c: string
          alternativa_correta: string
          alternativa_d: string
          categoria_id: string
          criado_em?: string
          enunciado: string
          explicacao?: string | null
          id?: string
        }
        Update: {
          alternativa_a?: string
          alternativa_b?: string
          alternativa_c?: string
          alternativa_correta?: string
          alternativa_d?: string
          categoria_id?: string
          criado_em?: string
          enunciado?: string
          explicacao?: string | null
          id?: string
        }
        Relationships: []
      }
      tokens: {
        Row: {
          criado_em: string
          email_comprador: string | null
          expires_at: string | null
          id: string
          nome_aluno: string | null
          nome_comprador: string | null
          status: string
          token: string
        }
        Insert: {
          criado_em?: string
          email_comprador?: string | null
          expires_at?: string | null
          id?: string
          nome_aluno?: string | null
          nome_comprador?: string | null
          status?: string
          token: string
        }
        Update: {
          criado_em?: string
          email_comprador?: string | null
          expires_at?: string | null
          id?: string
          nome_aluno?: string | null
          nome_comprador?: string | null
          status?: string
          token?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
