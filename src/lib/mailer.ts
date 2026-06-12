import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendWelcomeEmail(to: string, name: string) {
  await transporter.sendMail({
    from: `"BookZone" <${process.env.MAIL_USER}>`,
    to,
    subject: "Bienvenido a BookZone",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
      <body style="margin:0;padding:0;background-color:#f7f3e9;font-family:Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f3e9;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background-color:#fefcf5;border:2px solid #1c1410;">

                <!-- Header -->
                <tr>
                  <td style="background-color:#1c1410;padding:24px 40px;border-bottom:4px solid #c8860a;">
                    <span style="font-size:24px;font-weight:300;color:#f7f3e9;letter-spacing:4px;text-transform:uppercase;">BOOK</span><span style="font-size:24px;font-weight:900;color:#c8860a;letter-spacing:4px;text-transform:uppercase;">ZONE</span>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <p style="margin:0 0 8px;font-size:11px;font-weight:900;color:#c8860a;letter-spacing:3px;text-transform:uppercase;">Cuenta creada</p>
                    <h1 style="margin:0 0 24px;font-size:26px;font-weight:900;color:#1c1410;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #1c1410;padding-bottom:16px;">
                      Hola, ${name}
                    </h1>
                    <p style="margin:0 0 16px;font-size:14px;color:#5c3d2e;line-height:1.7;">
                      Tu cuenta en <strong style="color:#1c1410;">BookZone</strong> ha sido creada exitosamente. Ya puedes explorar nuestra colección completa de libros.
                    </p>
                    <p style="margin:0 0 32px;font-size:14px;color:#5c3d2e;line-height:1.7;">
                      Filtra por autor, agrega libros a favoritos y realiza tus compras directamente desde la tienda.
                    </p>
                    <div style="text-align:left;">
                      <a href="${process.env.NEXTAUTH_URL}" style="display:inline-block;background-color:#1c1410;color:#f7f3e9;font-size:11px;font-weight:900;padding:14px 32px;text-decoration:none;letter-spacing:3px;text-transform:uppercase;border:2px solid #1c1410;">
                        EXPLORAR LIBROS &rarr;
                      </a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px 40px;border-top:2px solid #1c1410;background-color:#e8e0cc;">
                    <p style="margin:0;font-size:11px;color:#5c3d2e;letter-spacing:2px;text-transform:uppercase;">
                      &copy; ${new Date().getFullYear()} BookZone &mdash; Todos los derechos reservados
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
}

interface SaleItem {
  productId: { name?: string; image?: string } | null;
  quantity: number;
  price: number;
}

interface SaleDocument {
  _id: unknown;
  items: SaleItem[];
  total: number;
  createdAt: Date;
}

export async function sendSalesReport(
  sales: SaleDocument[],
  month: number,
  year: number
) {
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];

  const monthLabel = `${monthNames[month - 1]} ${year}`;
  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  const totalOrders = sales.length;
  const totalItems = sales.reduce((acc, s) => acc + s.items.length, 0);

  const salesRows = sales
    .slice(0, 10)
    .map(
      (sale, i) => `
      <tr style="background-color:${i % 2 === 0 ? "#f7f3e9" : "#fefcf5"};">
        <td style="padding:10px 14px;font-size:12px;color:#5c3d2e;border-bottom:1px solid #e8e0cc;letter-spacing:1px;">
          ${new Date(sale.createdAt).toLocaleDateString("es-ES")}
        </td>
        <td style="padding:10px 14px;font-size:12px;color:#5c3d2e;border-bottom:1px solid #e8e0cc;">
          ${sale.items.length} art&iacute;culo(s)
        </td>
        <td style="padding:10px 14px;font-size:12px;font-weight:900;color:#1c1410;border-bottom:1px solid #e8e0cc;text-align:right;">
          $${sale.total.toFixed(2)}
        </td>
      </tr>
    `
    )
    .join("");

  const moreSales =
    totalOrders > 10
      ? `<tr><td colspan="3" style="padding:10px 14px;font-size:11px;color:#5c3d2e;text-align:center;letter-spacing:2px;text-transform:uppercase;">... y ${totalOrders - 10} &oacute;rdenes m&aacute;s</td></tr>`
      : "";

  await transporter.sendMail({
    from: `"BookZone" <${process.env.MAIL_USER}>`,
    to: process.env.REPORT_EMAIL,
    subject: `Reporte de ventas BookZone — ${monthLabel}`,
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
      <body style="margin:0;padding:0;background-color:#f7f3e9;font-family:Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f3e9;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fefcf5;border:2px solid #1c1410;">

                <!-- Header -->
                <tr>
                  <td style="background-color:#1c1410;padding:24px 40px;border-bottom:4px solid #c8860a;">
                    <span style="font-size:24px;font-weight:300;color:#f7f3e9;letter-spacing:4px;text-transform:uppercase;">BOOK</span><span style="font-size:24px;font-weight:900;color:#c8860a;letter-spacing:4px;text-transform:uppercase;">ZONE</span>
                    <p style="margin:8px 0 0;font-size:11px;color:#c8860a;letter-spacing:3px;text-transform:uppercase;">Reporte mensual de ventas</p>
                  </td>
                </tr>

                <!-- Summary title -->
                <tr>
                  <td style="padding:32px 40px 16px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:900;color:#c8860a;letter-spacing:3px;text-transform:uppercase;">Resumen</p>
                    <h2 style="margin:0 0 24px;font-size:22px;font-weight:900;color:#1c1410;text-transform:uppercase;border-bottom:2px solid #1c1410;padding-bottom:12px;">
                      ${monthLabel}
                    </h2>

                    <!-- Stats row -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="32%" style="text-align:center;padding:20px 16px;background-color:#e8e0cc;border:2px solid #1c1410;">
                          <div style="font-size:26px;font-weight:900;color:#1c1410;">$${totalRevenue.toFixed(2)}</div>
                          <div style="font-size:10px;color:#5c3d2e;margin-top:6px;letter-spacing:2px;text-transform:uppercase;">Ingresos</div>
                        </td>
                        <td width="2%"></td>
                        <td width="32%" style="text-align:center;padding:20px 16px;background-color:#e8e0cc;border:2px solid #1c1410;">
                          <div style="font-size:26px;font-weight:900;color:#1c1410;">${totalOrders}</div>
                          <div style="font-size:10px;color:#5c3d2e;margin-top:6px;letter-spacing:2px;text-transform:uppercase;">&Oacute;rdenes</div>
                        </td>
                        <td width="2%"></td>
                        <td width="32%" style="text-align:center;padding:20px 16px;background-color:#e8e0cc;border:2px solid #1c1410;">
                          <div style="font-size:26px;font-weight:900;color:#1c1410;">${totalItems}</div>
                          <div style="font-size:10px;color:#5c3d2e;margin-top:6px;letter-spacing:2px;text-transform:uppercase;">Libros</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Table -->
                <tr>
                  <td style="padding:24px 40px 32px;">
                    <p style="margin:0 0 12px;font-size:11px;font-weight:900;color:#c8860a;letter-spacing:3px;text-transform:uppercase;">Detalle de &oacute;rdenes</p>
                    ${
                      totalOrders === 0
                        ? `<p style="color:#5c3d2e;font-size:13px;text-align:center;padding:24px 0;border:2px dashed #5c3d2e;letter-spacing:2px;text-transform:uppercase;">No hubo ventas este mes</p>`
                        : `
                    <table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #1c1410;">
                      <thead>
                        <tr style="background-color:#1c1410;">
                          <th style="padding:10px 14px;font-size:10px;font-weight:900;color:#f7f3e9;text-align:left;letter-spacing:2px;text-transform:uppercase;">Fecha</th>
                          <th style="padding:10px 14px;font-size:10px;font-weight:900;color:#f7f3e9;text-align:left;letter-spacing:2px;text-transform:uppercase;">Art&iacute;culos</th>
                          <th style="padding:10px 14px;font-size:10px;font-weight:900;color:#c8860a;text-align:right;letter-spacing:2px;text-transform:uppercase;">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${salesRows}
                        ${moreSales}
                      </tbody>
                    </table>
                    `
                    }
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px 40px;border-top:2px solid #1c1410;background-color:#e8e0cc;">
                    <p style="margin:0;font-size:11px;color:#5c3d2e;letter-spacing:2px;text-transform:uppercase;">
                      Reporte generado el ${new Date().toLocaleDateString("es-ES")} &mdash; BookZone &copy; ${new Date().getFullYear()}
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
}
