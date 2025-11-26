export function renderDeleteAccountEmail({ code }: { code: string }): string {
  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Potwierdzenie usunięcia konta | Budgenix</title>
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
    .warning-box {
      margin-bottom: 20px;
      padding: 10px 12px;
      border-radius: 10px;
      background-color: #fef2f2;
      color: #991b1b;
      font-size: 12px;
      border: 1px solid #fecaca;
    }
    .code-box {
      margin: 18px 0 16px;
      padding: 14px 18px;
      border-radius: 999px;
      border: none;
      background-color: #dc2626;
      text-align: center;
      letter-spacing: 0.35em;
      font-size: 22px;
      font-weight: 700;
      color: #f9fafb;
    }
    .hint {
      font-size: 12px;
      line-height: 1.6;
      color: #6b7280;
      margin-top: 4px;
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
      .code-box {
        font-size: 20px;
        letter-spacing: 0.28em;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="brand-name">Budgenix</div>
        <div class="eyebrow">USUNIĘCIE KONTA</div>
      </div>

      <div class="content">
        <h1>Kod potwierdzenia usunięcia konta</h1>
        <p class="subtitle">
          Otrzymujesz tę wiadomość, ponieważ zażądano usunięcia Twojego konta w aplikacji Budgenix.
          Aby potwierdzić i dokończyć proces usunięcia konta, wprowadź poniższy kod.
        </p>

        <div class="warning-box">
          ⚠️ UWAGA: Usunięcie konta jest trwałe i nieodwracalne. Wszystkie Twoje dane, 
          w tym transakcje, budżety i ustawienia, zostaną permanentnie usunięte.
        </div>

        <div class="code-box">${code}</div>

        <p class="hint">
          Kod jest ważny przez 15 minut i może zostać użyty tylko raz. Nie udostępniaj go nikomu –
          zespół Budgenix nigdy nie poprosi Cię o podanie kodu weryfikacyjnego w wiadomości zwrotnej.
        </p>
      </div>

      <div class="footer">
        Jeśli to nie Ty zażądałeś usunięcia konta, zignoruj tę wiadomość i natychmiast 
        zmień swoje hasło oraz sprawdź ustawienia bezpieczeństwa.<br /><br />
        &copy; ${new Date().getFullYear()} Budgenix. Wszystkie prawa zastrzeżone.
      </div>
    </div>
  </div>
</body>
</html>`;
}
