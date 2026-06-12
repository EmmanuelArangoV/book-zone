import { NextRequest, NextResponse } from "next/server";
import { getSalesByMonth } from "@/services/salesService";
import { sendSalesReport } from "@/lib/mailer";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

    if (!authHeader || authHeader !== expectedToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const now = new Date();
    const year = now.getFullYear();
    // Report covers the previous month so the data is complete
    const month = now.getMonth() === 0 ? 12 : now.getMonth();
    const reportYear = now.getMonth() === 0 ? year - 1 : year;

    const sales = await getSalesByMonth(reportYear, month);

    await sendSalesReport(sales as never[], month, reportYear);

    return NextResponse.json({ message: "Reporte enviado" });
  } catch {
    return NextResponse.json(
      { error: "Error al generar el reporte" },
      { status: 500 }
    );
  }
}
