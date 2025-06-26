import React, { useEffect, useState } from "react";
import apiClient from "@/core/auth/auth";
import { PaymentReport, OverdueContract } from "./types";

const PaymentSummaryPage: React.FC = () => {
  const [report, setReport] = useState<PaymentReport | null>(null);
  const [overdueContracts, setOverdueContracts] = useState<OverdueContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const profileId = localStorage.getItem('profile_id');
      
      if (!profileId) {
        setError('프로필 정보가 없습니다.');
        return;
      }

      // X-Profile-ID 헤더 추가
      const headers = {
        'X-Profile-ID': profileId,
      };
      
      // 날짜 파라미터 구성
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const [reportRes, overdueRes] = await Promise.all([
        apiClient.get(`/payments/report?${params.toString()}`, { headers }),
        apiClient.get('/payments/overdue', { headers }),
      ]);
      console.log('Payment report response:', reportRes.data);
      console.log('Overdue contracts response:', overdueRes.data);
      setReport(reportRes.data);
      setOverdueContracts(overdueRes.data.overdue_contracts || []);
    } catch (err: any) {
      console.error('Payment API error:', err);
      setError(err.response?.data?.detail || "지급 현황 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDateFilter = () => {
    fetchData();
  };

  const handleResetDates = () => {
    setStartDate("");
    setEndDate("");
    fetchData();
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!report) return <div>데이터가 없습니다.</div>;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: "#1a1a1a" }}>지급 현황 보고서</h2>
      
      {/* 날짜 필터 */}
      <section style={{ marginBottom: 32, padding: 20, background: "#f8f9fa", borderRadius: 12, border: "1px solid #e9ecef" }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#495057" }}>날짜 필터</h3>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500, color: "#495057" }}>시작 날짜:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ 
                padding: "10px 12px", 
                border: "1px solid #ced4da", 
                borderRadius: 6, 
                fontSize: 14,
                minWidth: 150
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500, color: "#495057" }}>종료 날짜:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ 
                padding: "10px 12px", 
                border: "1px solid #ced4da", 
                borderRadius: 6, 
                fontSize: 14,
                minWidth: 150
              }}
            />
          </div>
          <button
            onClick={handleDateFilter}
            style={{
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = "#0056b3"}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = "#007bff"}
          >
            필터 적용
          </button>
          <button
            onClick={handleResetDates}
            style={{
              padding: "10px 20px",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = "#545b62"}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = "#6c757d"}
          >
            초기화
          </button>
        </div>
      </section>

      {/* 주요 지표 */}
      <section style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: "#1a1a1a" }}>주요 지표</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          <div style={{ 
            padding: 20, 
            background: "#d4edda", 
            borderRadius: 8, 
            border: "1px solid #c3e6cb",
            textAlign: "center"
          }}>
            <div style={{ fontSize: 14, color: "#155724", marginBottom: 4 }}>총 수입</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#155724" }}>
              {(report.summary?.total_income || 0).toLocaleString()}원
            </div>
          </div>
          <div style={{ 
            padding: 20, 
            background: "#f8d7da", 
            borderRadius: 8, 
            border: "1px solid #f5c6cb",
            textAlign: "center"
          }}>
            <div style={{ fontSize: 14, color: "#721c24", marginBottom: 4 }}>총 지출</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#721c24" }}>
              {(report.summary?.total_expense || 0).toLocaleString()}원
            </div>
          </div>
          <div style={{ 
            padding: 20, 
            background: "#d1ecf1", 
            borderRadius: 8, 
            border: "1px solid #bee5eb",
            textAlign: "center"
          }}>
            <div style={{ fontSize: 14, color: "#0c5460", marginBottom: 4 }}>미수금</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#0c5460" }}>
              {(report.summary?.unpaid_receivables || 0).toLocaleString()}원
            </div>
          </div>
          <div style={{ 
            padding: 20, 
            background: "#fff3cd", 
            borderRadius: 8, 
            border: "1px solid #ffeaa7",
            textAlign: "center"
          }}>
            <div style={{ fontSize: 14, color: "#856404", marginBottom: 4 }}>연체 지급금</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#856404" }}>
              {(report.summary?.overdue_payables || 0).toLocaleString()}원
            </div>
          </div>
        </div>
      </section>

      {/* 상세 현황 */}
      <section style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: "#1a1a1a" }}>상세 현황</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          <div style={{ 
            padding: 20, 
            background: "#e2e3e5", 
            borderRadius: 8, 
            border: "1px solid #d6d8db",
            textAlign: "center"
          }}>
            <div style={{ fontSize: 14, color: "#383d41", marginBottom: 4 }}>선수금</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#383d41" }}>
              {(report.summary?.prepaid_income || 0).toLocaleString()}원
            </div>
          </div>
          <div style={{ 
            padding: 20, 
            background: "#e2e3e5", 
            borderRadius: 8, 
            border: "1px solid #d6d8db",
            textAlign: "center"
          }}>
            <div style={{ fontSize: 14, color: "#383d41", marginBottom: 4 }}>선지급금</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#383d41" }}>
              {(report.summary?.prepaid_expense || 0).toLocaleString()}원
            </div>
          </div>
        </div>
      </section>

      {/* 임박 목록 */}
      <section style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: "#1a1a1a" }}>7일 내 임박 목록</h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 24 }}>
          {/* 받을 돈 */}
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#1976d2", padding: "8px 0", borderBottom: "2px solid #1976d2" }}>
              받을 돈 ({report.upcoming_receivables?.length || 0}건)
            </h4>
            {report.upcoming_receivables && report.upcoming_receivables.length > 0 ? (
              <div style={{ background: "white", borderRadius: 8, border: "1px solid #e9ecef", overflow: "hidden" }}>
                {report.upcoming_receivables.map((item) => (
                  <div key={item.id} style={{ 
                    padding: 16, 
                    borderBottom: "1px solid #e9ecef",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 14, color: "#6c757d" }}>{item.counterparty}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, color: "#1976d2", fontSize: 16 }}>
                        {item.amount.toLocaleString()}원
                      </div>
                      <div style={{ fontSize: 14, color: "#6c757d" }}>
                        {item.due_date.slice(0, 10)}
                      </div>
                    </div>
                    <div style={{ 
                      marginLeft: 16,
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "white",
                      background: item.days_until_due <= 1 ? "#dc3545" : item.days_until_due <= 3 ? "#fd7e14" : "#1976d2"
                    }}>
                      {item.days_until_due}일
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 24, background: "#f8f9fa", borderRadius: 8, textAlign: "center", color: "#6c757d" }}>
                7일 내 받을 돈이 없습니다.
              </div>
            )}
          </div>

          {/* 낼 돈 */}
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#d32f2f", padding: "8px 0", borderBottom: "2px solid #d32f2f" }}>
              낼 돈 ({report.upcoming_payables?.length || 0}건)
            </h4>
            {report.upcoming_payables && report.upcoming_payables.length > 0 ? (
              <div style={{ background: "white", borderRadius: 8, border: "1px solid #e9ecef", overflow: "hidden" }}>
                {report.upcoming_payables.map((item) => (
                  <div key={item.id} style={{ 
                    padding: 16, 
                    borderBottom: "1px solid #e9ecef",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 14, color: "#6c757d" }}>{item.counterparty}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, color: "#d32f2f", fontSize: 16 }}>
                        {item.amount.toLocaleString()}원
                      </div>
                      <div style={{ fontSize: 14, color: "#6c757d" }}>
                        {item.due_date.slice(0, 10)}
                      </div>
                    </div>
                    <div style={{ 
                      marginLeft: 16,
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "white",
                      background: item.days_until_due <= 1 ? "#dc3545" : item.days_until_due <= 3 ? "#fd7e14" : "#d32f2f"
                    }}>
                      {item.days_until_due}일
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 24, background: "#f8f9fa", borderRadius: 8, textAlign: "center", color: "#6c757d" }}>
                7일 내 낼 돈이 없습니다.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 연체 계약 목록 */}
      <section style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: "#1a1a1a" }}>
          연체 계약 목록 ({overdueContracts.length}건)
        </h3>
        {overdueContracts.length === 0 ? (
          <div style={{ padding: 24, background: "#f8f9fa", borderRadius: 8, textAlign: "center", color: "#6c757d" }}>
            연체된 계약이 없습니다.
          </div>
        ) : (
          <div style={{ background: "white", borderRadius: 8, border: "1px solid #e9ecef", overflow: "hidden" }}>
            <div style={{ 
              padding: 16, 
              background: "#f8f9fa", 
              borderBottom: "1px solid #e9ecef",
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 16,
              fontWeight: 600,
              color: "#495057"
            }}>
              <div>계약명</div>
              <div style={{ textAlign: "right" }}>총 금액</div>
              <div style={{ textAlign: "center" }}>연체일수</div>
              <div style={{ textAlign: "center" }}>지급기한</div>
            </div>
            {overdueContracts.map((c) => (
              <div key={c.id} style={{ 
                padding: 16, 
                borderBottom: "1px solid #e9ecef",
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                gap: 16,
                alignItems: "center"
              }}>
                <div style={{ fontWeight: 500 }}>{c.title}</div>
                <div style={{ textAlign: "right", fontWeight: 600, color: "#d32f2f" }}>
                  {c.total_price.toLocaleString()}원
                </div>
                <div style={{ textAlign: "center", fontWeight: 600, color: "#d32f2f" }}>
                  {c.days_overdue}일
                </div>
                <div style={{ textAlign: "center", color: "#6c757d" }}>
                  {c.payment_due_date?.slice(0, 10)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 계약별 지급 현황 */}
      <section>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: "#1a1a1a" }}>
          계약별 지급 현황 ({report.contracts?.length || 0}건)
        </h3>
        <div style={{ background: "white", borderRadius: 8, border: "1px solid #e9ecef", overflow: "hidden" }}>
          <div style={{ 
            padding: 16, 
            background: "#f8f9fa", 
            borderBottom: "1px solid #e9ecef",
            display: "grid",
            gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 0.5fr",
            gap: 16,
            fontWeight: 600,
            color: "#495057"
          }}>
            <div>계약명</div>
            <div>거래처</div>
            <div style={{ textAlign: "right" }}>수입</div>
            <div style={{ textAlign: "right" }}>지출</div>
            <div style={{ textAlign: "center" }}>상태</div>
            <div style={{ textAlign: "right" }}>미결제금액</div>
            <div style={{ textAlign: "center" }}>연체</div>
          </div>
          {(report.contracts || []).map((c) => (
            <div key={c.contract_name} style={{ 
              padding: 16, 
              borderBottom: "1px solid #e9ecef",
              display: "grid",
              gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 0.5fr",
              gap: 16,
              alignItems: "center",
              background: c.is_overdue ? "#fff3cd" : "transparent"
            }}>
              <div style={{ fontWeight: 500 }}>{c.contract_name}</div>
              <div style={{ color: "#6c757d" }}>{c.counterparty}</div>
              <div style={{ textAlign: "right", color: "#1976d2", fontWeight: 600 }}>
                {c.income ? c.income.toLocaleString() : "-"}
              </div>
              <div style={{ textAlign: "right", color: "#d32f2f", fontWeight: 600 }}>
                {c.expense ? c.expense.toLocaleString() : "-"}
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ 
                  padding: "4px 8px", 
                  borderRadius: 4, 
                  fontSize: 12, 
                  fontWeight: 500,
                  background: c.status === "paid" ? "#d4edda" : c.status === "unpaid" ? "#f8d7da" : "#fff3cd",
                  color: c.status === "paid" ? "#155724" : c.status === "unpaid" ? "#721c24" : "#856404"
                }}>
                  {c.status}
                </span>
              </div>
              <div style={{ textAlign: "right", fontWeight: 600 }}>
                {c.pending_amount ? c.pending_amount.toLocaleString() : "-"}
              </div>
              <div style={{ textAlign: "center" }}>
                {c.is_overdue ? <span style={{ color: "#d32f2f", fontSize: 18 }}>●</span> : "-"}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PaymentSummaryPage; 