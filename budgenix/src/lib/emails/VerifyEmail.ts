export function renderVerifyEmail({ verificationUrl }: { verificationUrl: string }): string {
  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Potwierdzenie adresu e‑mail | Budgenix</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #0f172a;
    }
    .wrapper {
      width: 100%;
      padding: 32px 16px;
    }
    .container {
      max-width: 640px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
      border: 1px solid #e5e7eb;
      overflow: hidden;
    }
    .header {
      padding: 16px 24px 14px;
      border-bottom: 1px solid #e5e7eb;
      background-color: #ffffff;
    }
    .brand-name {
      font-weight: 700;
      font-size: 19px;
      letter-spacing: 0.02em;
      color: #111827;
    }
    .eyebrow {
      margin-top: 4px;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #9ca3af;
    }
    .content {
      padding: 24px 24px 20px;
    }
    h1 {
      margin: 0 0 12px;
      font-size: 21px;
      line-height: 1.4;
      color: #111827;
    }
    .subtitle {
      font-size: 14px;
      line-height: 1.6;
      color: #4b5563;
      margin: 0 0 18px;
    }
    .info-box {
      margin-bottom: 20px;
      padding: 10px 12px;
      border-radius: 10px;
      background-color: #eff6ff;
      color: #1e3a8a;
      font-size: 12px;
      border: 1px solid #bfdbfe;
    }
    .button {
      display: inline-block;
      padding: 10px 22px;
      border-radius: 999px;
      background-color: #1d4ed8;
      color: #f9fafb !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 0.02em;
    }
    .button:hover {
      opacity: 0.97;
    }
    .hint {
      margin-top: 18px;
      font-size: 12px;
      line-height: 1.6;
      color: #6b7280;
    }
    .link {
      margin-top: 6px;
      font-size: 11px;
      color: #374151;
      word-break: break-all;
    }
    .footer {
      padding: 14px 24px 18px;
      border-top: 1px solid #e5e7eb;
      font-size: 11px;
      color: #6b7280;
      text-align: center;
      background-color: #f9fafb;
    }
    @media (max-width: 480px) {
      .container {
        border-radius: 0;
      }
      .content {
        padding: 20px 16px 16px;
      }
      h1 {
        font-size: 19px;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="brand-name">Budgenix</div>
        <div class="eyebrow">POTWIERDZENIE ADRESU E‑MAIL</div>
      </div>

      <div class="content">
        <h1>Potwierdź adres e‑mail do logowania</h1>
        <p class="subtitle">
          Zarejestrowano konto w Budgenix z wykorzystaniem tego adresu e‑mail.
          Aby dokończyć proces i uzyskać dostęp do panelu, potwierdź, że adres należy do Ciebie.
        </p>

        <div class="info-box">
          Ze względów bezpieczeństwa link aktywacyjny jest ważny 15 minut. 
          Po jego wygaśnięciu konieczne będzie wygenerowanie nowej wiadomości.
        </div>

        <p>
          <a href="${verificationUrl}" class="button" target="_blank" rel="noopener noreferrer">
            Potwierdź adres e‑mail
          </a>
        </p>

        <p class="hint">
          Jeśli przycisk się nie wyświetla poprawnie, skopiuj poniższy link i wklej go w pasku adresu przeglądarki:
        </p>
        <p class="link">${verificationUrl}</p>
      </div>

      <div class="footer">
        Jeśli to nie Ty zakładałeś konto w Budgenix, możesz bezpiecznie zignorować tę wiadomość –
        konto nie zostanie aktywowane bez kliknięcia w link.<br /><br />
        &copy; ${new Date().getFullYear()} Budgenix. Wszystkie prawa zastrzeżone.
      </div>
    </div>
  </div>
</body>
</html>`;
}
