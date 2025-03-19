import sql from 'mssql';

(async () => {
  try {
    await sql.connect({
      user: 'budgenix_user',
      password: 'Kuba2201$*',
      server: '57.128.159.250',
      database: 'BudgenixDB',
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    });

    console.log('✅ Połączenie udane!');
  } catch (err) {
    console.error('❌ Błąd połączenia:', err);
  }
})();
