// lib/services/pdf/pdfService.ts
import { pdf, Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Payment } from '@/lib/data/professional/payment';
import { Withdrawal } from '@/lib/data/professional/withdrawal';
import { OrderCommission } from '@/lib/data/professional/commission';
import { NepaliDateService } from '@/lib/utils/nepaliDate';
import { CurrencyFormatter } from '@/lib/utils/formatters';
import { FileDownloader } from '@/lib/utils/formatters';


// Register fonts (optional - for Nepali support)
// Font.register({
//   family: 'Nepali',
//   src: '/fonts/preeti.ttf'
// });

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 3
  },
  companyInfo: {
    marginBottom: 15
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  label: {
    color: '#6B7280',
    fontSize: 9
  },
  value: {
    color: '#1F2937',
    fontWeight: 'bold',
    fontSize: 9
  },
  section: {
    marginTop: 15,
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D1D5DB',
    paddingBottom: 4
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    marginTop: 10
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB'
  },
  tableHeader: {
    backgroundColor: '#F9FAFB',
    fontWeight: 'bold'
  },
  tableCell: {
    padding: 8,
    fontSize: 8,
    flex: 1
  },
  status: {
    padding: '4 8',
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
    paddingTop: 15
  }
});

export class PDFService {
  // ============ WITHDRAWAL RECEIPT ============
  static async generateWithdrawalReceipt(
    withdrawal: Withdrawal,
    companyInfo: {
      name: string;
      address: string;
      phone: string;
      email: string;
    },
    professionalName?: string
  ): Promise<void> {
    const ReceiptDocument = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header with Status */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.title}>{companyInfo.name}</Text>
                <Text style={styles.subtitle}>{companyInfo.address}</Text>
                <Text style={styles.subtitle}>Contact: {companyInfo.phone}</Text>
                <Text style={styles.subtitle}>Email: {companyInfo.email}</Text>
              </View>
              <View style={{
                padding: '8 16',
                borderWidth: 2,
                borderColor: this.getStatusColor(withdrawal.status),
                borderRadius: 4,
                transform: 'rotate(-5deg)'
              }}>
                <Text style={{
                  color: this.getStatusColor(withdrawal.status),
                  fontWeight: 'bold',
                  fontSize: 14
                }}>
                  {withdrawal.status}
                </Text>
              </View>
            </View>
          </View>

          {/* Receipt Info */}
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Withdrawal ID:</Text>
              <Text style={styles.value}>WD-{withdrawal.id}</Text>
            </View>
            <View>
              <Text style={styles.label}>Reference:</Text>
              <Text style={styles.value}>{withdrawal.reference_id}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>
                {NepaliDateService.format(withdrawal.request_date_np, 'yyyy-MM-dd, hh:mm a')}
              </Text>
            </View>
            <View>
              <Text style={styles.label}>Professional:</Text>
              <Text style={styles.value}>{professionalName || `PRO-${withdrawal.professional_id}`}</Text>
            </View>
          </View>

          {/* Withdrawal Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>WITHDRAWAL DETAILS</Text>
            <View style={{ backgroundColor: '#F9FAFB', padding: 12, borderRadius: 4 }}>
              <View style={styles.row}>
                <Text style={styles.label}>Amount:</Text>
                <Text style={{ ...styles.value, fontSize: 14 }}>
                  {CurrencyFormatter.format(withdrawal.amount)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Payout Method:</Text>
                <Text style={styles.value}>{withdrawal.payout_method}</Text>
              </View>
              {withdrawal.notes && (
                <View style={styles.row}>
                  <Text style={styles.label}>Notes:</Text>
                  <Text style={styles.value}>{withdrawal.notes}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TRANSACTION SUMMARY</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>Description</Text>
                <Text style={[styles.tableCell, { textAlign: 'right' }]}>Amount</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Withdrawal Amount</Text>
                <Text style={[styles.tableCell, { textAlign: 'right' }]}>
                  {CurrencyFormatter.format(withdrawal.amount)}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Processing Fee</Text>
                <Text style={[styles.tableCell, { textAlign: 'right' }]}>Rs. 0.00</Text>
              </View>
              <View style={[styles.tableRow, { backgroundColor: '#F3F4F6' }]}>
                <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Net Amount Payable</Text>
                <Text style={[styles.tableCell, { textAlign: 'right', fontWeight: 'bold' }]}>
                  {CurrencyFormatter.format(withdrawal.amount)}
                </Text>
              </View>
            </View>
          </View>

          {/* Notes Section */}
          <View style={[styles.section, { marginTop: 20 }]}>
            <View style={{ borderWidth: 0.5, borderColor: '#E5E7EB', padding: 12, borderRadius: 4 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 5 }}>NOTES</Text>
              <Text style={{ fontSize: 9, marginBottom: 8 }}>
                {withdrawal.notes || 'No additional notes'}
              </Text>
              <Text style={{ fontSize: 8, color: '#6B7280' }}>• This receipt is generated automatically by the system</Text>
              <Text style={{ fontSize: 8, color: '#6B7280' }}>• For any queries, contact support</Text>
              <Text style={{ fontSize: 8, color: '#6B7280' }}>• Processing time: 3-5 business days</Text>
            </View>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            This is an auto-generated receipt • {NepaliDateService.formatWithTime(new Date())}
          </Text>
        </Page>
      </Document>
    );

    const blob = await pdf(ReceiptDocument()).toBlob();
    const filename = `withdrawal_receipt_${withdrawal.id}_${Date.now()}.pdf`;
    await FileDownloader.downloadFromData(blob, filename);
  }

  // ============ WITHDRAWAL SUMMARY PDF ============
  static async generateWithdrawalSummary(
    withdrawals: Withdrawal[],
    companyInfo: {
      name: string;
      address: string;
      phone: string;
      email: string;
    },
    professionalName?: string,
    period?: string
  ): Promise<void> {
    const totalWithdrawn = withdrawals.reduce((sum, w) => sum + w.amount, 0);
    const completed = withdrawals.filter(w => w.status === 'completed').length;
    const pending = withdrawals.filter(w => w.status === 'pending').length;
    const approved = withdrawals.filter(w => w.status === 'approved').length;
    const rejected = withdrawals.filter(w => w.status === 'rejected').length;
    const successRate = completed + rejected > 0 
      ? ((completed / (completed + rejected)) * 100).toFixed(1)
      : '0.0';

    const SummaryDocument = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.title}>{companyInfo.name}</Text>
                <Text style={styles.subtitle}>{companyInfo.address}</Text>
                <Text style={styles.subtitle}>Withdrawal Summary Report</Text>
                {period && <Text style={styles.subtitle}>Period: {period}</Text>}
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.label}>Generated on</Text>
                <Text style={styles.value}>
                  {NepaliDateService.formatWithTime(new Date())}
                </Text>
                {professionalName && (
                  <Text style={styles.value}>Professional: {professionalName}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Statistics Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SUMMARY STATISTICS</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {[
                { label: 'Total Withdrawn', value: CurrencyFormatter.format(totalWithdrawn) },
                { label: 'Completed', value: completed.toString() },
                { label: 'Pending', value: pending.toString() },
                { label: 'Approved', value: approved.toString() },
                { label: 'Rejected', value: rejected.toString() },
                { label: 'Success Rate', value: `${successRate}%` }
              ].map((stat, i) => (
                <View key={i} style={{
                  width: '30%',
                  padding: 8,
                  borderWidth: 0.5,
                  borderColor: '#E5E7EB',
                  borderRadius: 4,
                  marginBottom: 8
                }}>
                  <Text style={{ fontSize: 8, color: '#6B7280', marginBottom: 4 }}>{stat.label}</Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1F2937' }}>{stat.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Transactions Table */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>WITHDRAWAL TRANSACTIONS</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>ID</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>Date</Text>
                <Text style={[styles.tableCell, { flex: 1.2 }]}>Amount</Text>
                <Text style={[styles.tableCell, { flex: 1.2 }]}>Method</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Status</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>Reference</Text>
              </View>
              {withdrawals.slice(0, 20).map((w, i) => (
                <View key={i} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{w.id}</Text>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>
                    {NepaliDateService.formatDate(w.request_date_np)}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1.2 }]}>
                    {CurrencyFormatter.format(w.amount)}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1.2 }]}>{w.payout_method}</Text>
                  <Text style={[styles.tableCell, { flex: 1, color: this.getStatusColor(w.status) }]}>
                    {w.status.toUpperCase()}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{w.reference_id}</Text>
                </View>
              ))}
            </View>
            {withdrawals.length > 20 && (
              <Text style={{ fontSize: 8, color: '#6B7280', marginTop: 8 }}>
                Showing first 20 of {withdrawals.length} transactions
              </Text>
            )}
          </View>

          <Text style={styles.footer}>
            Total Withdrawals: {withdrawals.length} | Total Amount: {CurrencyFormatter.format(totalWithdrawn)} • 
            This report is generated automatically by Doorsteps System
          </Text>
        </Page>
      </Document>
    );

    const blob = await pdf(SummaryDocument()).toBlob();
    const filename = `withdrawal_summary_${Date.now()}.pdf`;
    await FileDownloader.downloadFromData(blob, filename);
  }

  // ============ PAYMENT RECEIPT ============
  static async generatePaymentReceipt(
    payment: Payment,
    order: any,
    companyInfo: {
      name: string;
      address: string;
      phone: string;
      email: string;
    }
  ): Promise<void> {
    const ReceiptDocument = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.title}>{companyInfo.name}</Text>
                <Text style={styles.subtitle}>{companyInfo.address}</Text>
                <Text style={styles.subtitle}>Payment Receipt</Text>
              </View>
              <View style={{
                padding: '8 16',
                borderWidth: 2,
                borderColor: payment.payment_status === 'completed' ? '#10B981' : '#F59E0B',
                borderRadius: 4
              }}>
                <Text style={{
                  color: payment.payment_status === 'completed' ? '#10B981' : '#F59E0B',
                  fontWeight: 'bold',
                  fontSize: 12
                }}>
                  {payment.payment_status.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Receipt No:</Text>
              <Text style={styles.value}>PAY-{payment.id}</Text>
            </View>
            <View>
              <Text style={styles.label}>Order ID:</Text>
              <Text style={styles.value}>#{payment.order_id}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>
                {NepaliDateService.formatWithTime(payment.payment_date)}
              </Text>
            </View>
            <View>
              <Text style={styles.label}>Payment Method:</Text>
              <Text style={styles.value}>{payment.payment_method}</Text>
            </View>
          </View>

          <View style={[styles.section, { marginTop: 20 }]}>
            <Text style={styles.sectionTitle}>PAYMENT DETAILS</Text>
            <View style={{ backgroundColor: '#F9FAFB', padding: 12, borderRadius: 4 }}>
              <View style={styles.row}>
                <Text style={styles.label}>Amount Paid:</Text>
                <Text style={{ ...styles.value, fontSize: 16, color: '#059669' }}>
                  {CurrencyFormatter.format(payment.amount)}
                </Text>
              </View>
              {payment.transaction_id && (
                <View style={styles.row}>
                  <Text style={styles.label}>Transaction ID:</Text>
                  <Text style={styles.value}>{payment.transaction_id}</Text>
                </View>
              )}
              {payment.notes && (
                <View style={styles.row}>
                  <Text style={styles.label}>Notes:</Text>
                  <Text style={styles.value}>{payment.notes}</Text>
                </View>
              )}
              {payment.isProfessional && (
                <View style={{ marginTop: 8, padding: 8, backgroundColor: '#FEF3C7', borderRadius: 4 }}>
                  <Text style={{ fontSize: 8, color: '#92400E' }}>
                    ⚠️ This payment was recorded by the professional
                  </Text>
                </View>
              )}
            </View>
          </View>

          <Text style={styles.footer}>
            This is a computer generated receipt • {NepaliDateService.formatWithTime(new Date())}
          </Text>
        </Page>
      </Document>
    );

    const blob = await pdf(ReceiptDocument()).toBlob();
    const filename = `payment_receipt_${payment.id}_${Date.now()}.pdf`;
    await FileDownloader.downloadFromData(blob, filename);
  }

  // ============ COMMISSION REPORT ============
  static async generateCommissionReport(
    commissions: OrderCommission[],
    professionalName: string,
    professionalId: number,
    companyInfo: {
      name: string;
      address: string;
      phone: string;
      email: string;
    },
    period?: string
  ): Promise<void> {
    const totalOrderValue = commissions.reduce((sum, c) => sum + c.order_total, 0);
    const totalCommission = commissions.reduce((sum, c) => sum + c.commission_amt, 0);
    const totalEarnings = totalOrderValue - totalCommission;
    const avgRate = totalOrderValue > 0 ? (totalCommission / totalOrderValue * 100).toFixed(1) : '0.0';

    const ReportDocument = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.title}>{companyInfo.name}</Text>
                <Text style={styles.subtitle}>Earnings & Commission Report</Text>
              </View>
              <View style={{
                padding: '8 16',
                borderWidth: 2,
                borderColor: '#059669',
                borderRadius: 4,
                transform: 'rotate(-5deg)'
              }}>
                <Text style={{ color: '#059669', fontWeight: 'bold', fontSize: 12 }}>
                  OFFICIAL REPORT
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 15 }}>
              <Text style={styles.value}>Professional: {professionalName}</Text>
              <Text style={styles.label}>ID: PRO-{professionalId}</Text>
              {period && <Text style={styles.label}>Period: {period}</Text>}
              <Text style={styles.label}>Generated: {NepaliDateService.formatWithTime(new Date())}</Text>
            </View>
          </View>

          {/* Earnings Summary */}
          <View style={[styles.section, { backgroundColor: '#F0FDF4', padding: 15, borderRadius: 8 }]}>
            <Text style={[styles.sectionTitle, { color: '#065F46' }]}>YOUR EARNINGS SUMMARY</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <View>
                <Text style={styles.label}>Total Orders</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#065F46' }}>{commissions.length}</Text>
              </View>
              <View>
                <Text style={styles.label}>Total Order Value</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937' }}>
                  {CurrencyFormatter.format(totalOrderValue)}
                </Text>
              </View>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: '#D1FAE5', marginVertical: 10 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.label}>Platform Fee</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#6B7280' }}>
                  {CurrencyFormatter.format(totalCommission)}
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: '#D1FAE5' }} />
              <View>
                <Text style={styles.label}>YOUR EARNINGS</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#059669' }}>
                  {CurrencyFormatter.format(totalEarnings)}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={[styles.section, { flexDirection: 'row', justifyContent: 'space-around' }]}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.label}>Avg. Fee Rate</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#3B82F6' }}>{avgRate}%</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.label}>Net per Order</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#059669' }}>
                {CurrencyFormatter.format(totalEarnings / commissions.length)}
              </Text>
            </View>
          </View>

          {/* Transactions Table */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RECENT TRANSACTIONS</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Order</Text>
                <Text style={[styles.tableCell, { flex: 1.2 }]}>Date</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Amount</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Fee %</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Platform Fee</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Your Earnings</Text>
              </View>
              {commissions.slice(0, 10).map((c, i) => {
                const earnings = c.order_total - c.commission_amt;
                  const rateApplied = c?.rate_applied || 0;
                return (
                  <View key={i} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 0.8 }]}>#{c.order_id}</Text>
                    <Text style={[styles.tableCell, { flex: 1.2 }]}>
                      {NepaliDateService.formatDate(c.completed_date_np)}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>
                      {CurrencyFormatter.format(c.order_total)}
                    </Text>
                      <Text style={[styles.tableCell, { flex: 0.8 }]}>
                      {rateApplied.toFixed(1)}%
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1, color: '#3B82F6' }]}>
                      {CurrencyFormatter.format(c.commission_amt)}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1, color: '#059669' }]}>
                      {CurrencyFormatter.format(earnings)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <Text style={styles.footer}>
            Thank you for your hard work, {professionalName}! • {NepaliDateService.formatDate(new Date())}
          </Text>
        </Page>
      </Document>
    );

    const blob = await pdf(ReportDocument()).toBlob();
    const filename = `earnings_report_${professionalName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    await FileDownloader.downloadFromData(blob, filename);
  }

  private static getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      pending: '#F59E0B',
      approved: '#3B82F6',
      rejected: '#EF4444',
      completed: '#10B981',
      default: '#6B7280'
    };
    return colors[status] || colors.default;
  }
}