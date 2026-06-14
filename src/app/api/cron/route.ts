import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Sale from "@/models/Sale";
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
    const month = now.getMonth() === 0 ? 12 : now.getMonth();
    const reportYear = now.getMonth() === 0 ? year - 1 : year;

    await connectDB();
    const start = new Date(reportYear, month - 1, 1);
    const end = new Date(reportYear, month, 1);
    const sales = await Sale.find({ createdAt: { $gte: start, $lt: end } }).populate(
      "items.productId",
      "name image"
    );

    await sendSalesReport(sales as never[], month, reportYear);

    return NextResponse.json({ message: "Reporte enviado" });
  } catch {
    return NextResponse.json({ error: "Error al generar el reporte" }, { status: 500 });
  }
}
