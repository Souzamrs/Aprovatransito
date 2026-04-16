import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen fade-in">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <h1 className="text-3xl font-bold">
          Termos de <span className="text-primary">Serviço</span>
        </h1>

        <div className="prose prose-invert prose-sm max-w-none space-y-6">
          <section className="glass-card p-6 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">1. Acesso à Plataforma</h2>
            <p className="text-muted-foreground leading-relaxed">
              O acesso à plataforma <strong className="text-foreground">Aprovado no Trânsito</strong> é realizado
              exclusivamente através de um token individual enviado após a confirmação do pagamento. Cada token é
              pessoal e intransferível.
            </p>
          </section>

          <section className="glass-card p-6 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">2. Validade do Acesso</h2>
            <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
              <li>
                O acesso à plataforma é válido por <strong className="text-foreground">6 (seis) meses</strong> a
                partir da data da compra.
              </li>
              <li>
                Após esse prazo, o acesso é <strong className="text-foreground">automaticamente suspenso</strong>,
                impedindo o login na plataforma.
              </li>
              <li>
                Para renovar o acesso, o aluno deve entrar em contato pelo{" "}
                <a
                  href="https://wa.me/5531981046221"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  WhatsApp (31) 98104-6221
                </a>.
              </li>
              <li>
                Não há garantia de disponibilidade do conteúdo após o período de acesso.
              </li>
            </ul>
          </section>

          <section className="glass-card p-6 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">3. Política de Reembolso</h2>
            <p className="text-muted-foreground leading-relaxed">
              O valor pago <strong className="text-foreground">não é reembolsável</strong> após o início do acesso
              ao conteúdo da plataforma. Ao adquirir o produto, o aluno concorda com esses termos.
            </p>
          </section>

          <section className="glass-card p-6 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">4. Conteúdo</h2>
            <p className="text-muted-foreground leading-relaxed">
              Todo o conteúdo disponibilizado na plataforma é de propriedade intelectual do Aprovado no Trânsito.
              É proibida a reprodução, distribuição ou compartilhamento do material sem autorização prévia.
            </p>
          </section>

          <section className="glass-card p-6 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">5. Suporte</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para dúvidas, suporte técnico ou renovação de acesso, entre em contato pelo{" "}
              <a
                href="https://wa.me/5531981046221"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                WhatsApp (31) 98104-6221
              </a>.
            </p>
          </section>
        </div>

        <p className="text-xs text-muted-foreground text-center pt-4">
          Última atualização: Março de 2026
        </p>
      </div>
    </div>
  );
};

export default Terms;
