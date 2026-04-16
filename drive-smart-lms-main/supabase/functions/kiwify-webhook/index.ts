import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-kiwify-signature",
};

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "tk_";
  for (let i = 0; i < 18; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function sendEmail(to: string, name: string, token: string, siteUrl: string) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) throw new Error("RESEND_API_KEY not configured");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <h2 style="color:#16a34a;">Seu acesso ao Aprovado no Trânsito está liberado! 🎉</h2>
      <p>Olá, <strong>${name}</strong>!</p>
      <p>Seu token de acesso exclusivo é:</p>
      <div style="background:#111;color:#16a34a;font-size:24px;font-weight:bold;text-align:center;padding:20px;border-radius:8px;letter-spacing:2px;margin:20px 0;">
        ${token}
      </div>
      <h3>Como acessar:</h3>
      <ol>
        <li>Acesse: <a href="${siteUrl}/login" style="color:#16a34a;">${siteUrl}/login</a></li>
        <li>Cole o token no campo de acesso</li>
        <li>Clique em <strong>"Entrar"</strong> e comece a estudar! 🚗</li>
      </ol>
      <p style="margin-top:20px;color:#888;font-size:14px;">⏳ Seu acesso é válido por <strong>6 meses</strong> a partir de hoje.</p>
      <hr style="border:none;border-top:1px solid #333;margin:30px 0;" />
      <p style="color:#888;font-size:14px;">Dúvidas? WhatsApp: <a href="https://wa.me/5531981046221" style="color:#16a34a;">(31) 98104-6221</a></p>
      <p style="color:#888;font-size:14px;">— Equipe Aprovado no Trânsito</p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Aprovado no Trânsito <noreply@resend.dev>",
      to: [to],
      subject: "Seu acesso ao Aprovado no Trânsito está liberado! 🎉",
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }
  return res.json();
}

function verifySignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const hmac = createHmac("sha256", secret);
  hmac.update(body);
  const expected = hmac.digest("hex");
  return expected === signature;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookSecret = Deno.env.get("KIWIFY_WEBHOOK_SECRET");
    if (!webhookSecret) {
      return new Response(JSON.stringify({ error: "Webhook secret not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rawBody = await req.text();
    const signature = req.headers.get("x-kiwify-signature") || req.headers.get("signature");

    if (!verifySignature(rawBody, signature, webhookSecret)) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = JSON.parse(rawBody);
    const orderStatus = payload.order_status || payload.order?.status;

    if (orderStatus !== "paid" && orderStatus !== "approved") {
      return new Response(JSON.stringify({ message: "Ignored status", status: orderStatus }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customer = payload.customer || payload.Customer || {};
    const name = customer.full_name || customer.name || "Aluno";
    const email = customer.email;

    if (!email) {
      return new Response(JSON.stringify({ error: "No customer email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Generate unique token
    let token = generateToken();
    let attempts = 0;
    while (attempts < 10) {
      const { data: existing } = await supabase
        .from("tokens")
        .select("id")
        .eq("token", token)
        .maybeSingle();
      if (!existing) break;
      token = generateToken();
      attempts++;
    }

    // Calculate expiration (6 months from now)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 6);

    // Save token
    const { error: insertError } = await supabase.from("tokens").insert({
      token,
      status: "ativo",
      nome_aluno: name,
      email_comprador: email,
      nome_comprador: name,
      expires_at: expiresAt.toISOString(),
    });

    if (insertError) {
      throw new Error(`DB insert error: ${insertError.message}`);
    }

    // Send email
    const siteUrl = Deno.env.get("SITE_URL") || "https://aprovadonotransito.com.br";
    await sendEmail(email, name, token, siteUrl);

    return new Response(
      JSON.stringify({ success: true, message: "Token generated and email sent" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
