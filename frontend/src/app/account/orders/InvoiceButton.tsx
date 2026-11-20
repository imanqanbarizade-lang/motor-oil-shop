"use client";

import { useState } from "react";
import { CustomerOrder, getOrderInvoice } from "../../../lib/api";

interface Props {
  order: CustomerOrder;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("fa-IR");
}

function escapeHtml(value: unknown) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[char];
  });
}

export default function InvoiceButton({ order }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const paymentApproved = order.payment_status === "approved";

  async function printInvoice() {
    if (!paymentApproved || loading) return;

    setError("");
    setLoading(true);

    try {
      const invoice = await getOrderInvoice(order.id);

      if (invoice.payment_status !== "approved") {
        throw new Error("پرداخت این سفارش هنوز توسط مدیر تأیید نشده است.");
      }

      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        throw new Error(
          "امکان باز کردن فاکتور وجود ندارد. اجازه باز شدن پنجره را فعال کنید."
        );
      }

      const productsTotal = invoice.order_items.reduce(
        (total, item) => total + Number(item.total_price),
        0
      );

      const shippingCost = Number(invoice.shipping_cost ?? 0);

      const productsRows = invoice.order_items
        .map(
          (item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${escapeHtml(item.product_name)}</td>
              <td>${formatPrice(Number(item.unit_price))}</td>
              <td>${Number(item.quantity).toLocaleString("fa-IR")}</td>
              <td>${formatPrice(Number(item.total_price))}</td>
            </tr>
          `
        )
        .join("");

      const html = `
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>فاکتور سفارش ${invoice.id}</title>

          <style>
            @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap');

            * { box-sizing: border-box; }

            body {
              font-family: Vazirmatn, Tahoma, sans-serif;
              direction: rtl;
              color: #1e293b;
              background: #fff;
              margin: 0;
              padding: 35px;
            }

            .invoice { max-width: 850px; margin: auto; }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 3px solid #ea580c;
              padding-bottom: 20px;
            }

            .logo { font-size: 32px; font-weight: 800; color: #ea580c; }
            .subtitle { color: #64748b; font-size: 13px; }
            h2 { font-size: 22px; margin-top: 28px; }

            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-top: 22px;
            }

            .info-box {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 10px;
              padding: 15px;
              line-height: 2;
              font-size: 13px;
            }

            .label { color: #64748b; font-size: 12px; }
            .value { font-weight: 700; }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 22px;
              font-size: 12px;
            }

            th { background: #fff7ed; color: #9a3412; }

            th, td {
              border: 1px solid #e2e8f0;
              padding: 12px 8px;
              text-align: center;
            }

            .totals {
              width: 340px;
              max-width: 100%;
              margin: 25px 0 0 auto;
              background: #fff7ed;
              border-radius: 10px;
              padding: 15px;
            }

            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 9px 0;
              font-size: 13px;
            }

            .final-total {
              border-top: 1px solid #fed7aa;
              margin-top: 8px;
              padding-top: 15px;
              font-size: 16px;
              font-weight: 800;
              color: #c2410c;
            }

            .address {
              margin-top: 20px;
              padding: 15px;
              border: 1px solid #e2e8f0;
              border-radius: 10px;
              font-size: 13px;
              line-height: 2;
            }

            .footer {
              text-align: center;
              margin-top: 45px;
              padding-top: 18px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: 12px;
            }

            .print-button {
              display: block;
              margin: 25px auto;
              background: #ea580c;
              color: white;
              border: 0;
              border-radius: 8px;
              padding: 12px 30px;
              font-family: inherit;
              font-size: 14px;
              cursor: pointer;
            }

            @media print {
              body { padding: 0; }
              .print-button { display: none; }
              @page { size: A4; margin: 15mm; }
            }

            @media screen and (max-width: 600px) {
              body { padding: 15px; }
              .info-grid { grid-template-columns: 1fr; }
            }
          </style>
        </head>

        <body>
          <div class="invoice">
            <div class="header">
              <div>
                <div class="logo">Oilino</div>
                <div class="subtitle">فروشگاه اینترنتی روغن موتور</div>
              </div>
              <div>
                <strong>فاکتور فروش</strong>
                <div class="subtitle">
                  شماره فاکتور: ${invoice.id.toLocaleString("fa-IR")}
                </div>
              </div>
            </div>

            <h2>مشخصات سفارش</h2>

            <div class="info-grid">
              <div class="info-box">
                <div class="label">شماره سفارش</div>
                <div class="value">#${invoice.id.toLocaleString("fa-IR")}</div>
              </div>
              <div class="info-box">
                <div class="label">تاریخ ثبت سفارش</div>
                <div class="value">${formatDate(invoice.created_at)}</div>
              </div>
              <div class="info-box">
                <div class="label">نام مشتری / تحویل‌گیرنده</div>
                <div class="value">${escapeHtml(invoice.full_name)}</div>
              </div>
              <div class="info-box">
                <div class="label">شماره تماس</div>
                <div class="value" dir="ltr">${escapeHtml(invoice.phone)}</div>
              </div>
            </div>

            <h2>جزئیات محصولات</h2>

            <table>
              <thead>
                <tr>
                  <th>ردیف</th>
                  <th>نام محصول</th>
                  <th>قیمت واحد</th>
                  <th>تعداد</th>
                  <th>مبلغ کل</th>
                </tr>
              </thead>
              <tbody>${productsRows}</tbody>
            </table>

            <div class="totals">
              <div class="total-row">
                <span>جمع مبلغ محصولات</span>
                <strong>${formatPrice(productsTotal)}</strong>
              </div>
              <div class="total-row">
                <span>هزینه ارسال با پست</span>
                <strong>${formatPrice(shippingCost)}</strong>
              </div>
              <div class="total-row final-total">
                <span>مبلغ نهایی</span>
                <strong>${formatPrice(Number(invoice.total_amount))}</strong>
              </div>
            </div>

            <div class="address">
              <strong>اطلاعات ارسال</strong><br>
              استان: ${escapeHtml(invoice.province)}<br>
              شهر: ${escapeHtml(invoice.city)}<br>
              آدرس: ${escapeHtml(invoice.address)}<br>
              کد پستی: ${escapeHtml(invoice.postal_code || "ثبت نشده")}
            </div>

            ${
              invoice.description
                ? `<div class="address">
                    <strong>توضیحات سفارش</strong><br>
                    ${escapeHtml(invoice.description)}
                  </div>`
                : ""
            }

            <div class="footer">
              از خرید شما از Oilino سپاسگزاریم.
              <br>
              این فاکتور بر اساس اطلاعات ثبت‌شده سفارش صادر شده است.
            </div>

            <button class="print-button" onclick="window.print()">
              چاپ فاکتور / ذخیره PDF
            </button>
          </div>
        </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "دریافت فاکتور با خطا مواجه شد."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={printInvoice}
        disabled={!paymentApproved || loading}
        className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
          paymentApproved
            ? "bg-slate-800 text-white hover:bg-slate-700"
            : "cursor-not-allowed bg-slate-200 text-slate-400"
        }`}
      >
        {loading
          ? "در حال دریافت فاکتور..."
          : "دریافت فاکتور PDF"}
      </button>

      {!paymentApproved && (
        <p className="text-xs text-slate-500">
          فاکتور پس از تأیید پرداخت توسط مدیر فعال می‌شود.
        </p>
      )}

      {error && (
        <p className="max-w-xs text-xs leading-6 text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}