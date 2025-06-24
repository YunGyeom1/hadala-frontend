import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShipmentResponse } from './types';
import { ProductQuality, ShipmentStatus, qualityToString } from '../common/types';
import { format } from 'date-fns';
import { shipmentService } from './services/shipmentService';

interface ShipmentDetailProps {
  shipment: ShipmentResponse;
}

const getStatusLabel = (status: ShipmentStatus | string) => {
  switch (status) {
    case ShipmentStatus.DELIVERED:
      return '배송완료';
    case ShipmentStatus.IN_TRANSIT:
      return '배송중';
    case ShipmentStatus.PENDING:
      return '대기중';
    default:
      return '알 수 없음';
  }
};

const ShipmentDetail: React.FC<ShipmentDetailProps> = ({ shipment }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = React.useState<ShipmentStatus | string>(shipment.shipment_status);
  const [saving, setSaving] = React.useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ShipmentStatus;
    setStatus(newStatus);
    setSaving(true);
    try {
      await shipmentService.updateShipment(shipment.id, { ...shipment, shipment_status: newStatus });
      alert('출하 상태가 변경되었습니다.');
    } catch (error: any) {
      alert(error.message || '상태 변경에 실패했습니다.');
      setStatus(shipment.shipment_status); // 실패 시 원복
    } finally {
      setSaving(false);
    }
  };

  // 품목 총계 계산
  const totalPrice = shipment.items.reduce((sum, item) => sum + (item.total_price || 0), 0);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* 출하 기본 정보 */}
            <div>
              <h2 className="text-lg font-medium mb-4">기본 정보</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">제목</dt>
                  <dd className="mt-1 text-sm text-gray-900">{shipment.title}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">상태</dt>
                  <dd className="mt-1">
                    <select
                      value={status}
                      onChange={handleStatusChange}
                      className="select select-bordered"
                      disabled={saving}
                    >
                      {Object.values(ShipmentStatus).map((s) => (
                        <option key={s} value={s}>{getStatusLabel(s)}</option>
                      ))}
                    </select>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">출하일시</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {shipment.shipment_datetime ? format(new Date(shipment.shipment_datetime), 'yyyy-MM-dd HH:mm') : '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">출하 ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{shipment.id}</dd>
                </div>
              </dl>
            </div>
            {/* 거래처 정보 */}
            <div>
              <h2 className="text-lg font-medium mb-4">거래처 정보</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">공급사</dt>
                  <dd className="mt-1 text-sm text-gray-900">{shipment.supplier_company?.name || '-'}</dd>
                  {shipment.supplier_person?.username && (
                    <dd className="text-sm text-gray-500">{shipment.supplier_person.username}</dd>
                  )}
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">수신사</dt>
                  <dd className="mt-1 text-sm text-gray-900">{shipment.receiver_company?.name || '-'}</dd>
                  {shipment.receiver_person?.username && (
                    <dd className="text-sm text-gray-500">{shipment.receiver_person.username}</dd>
                  )}
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">출발 센터</dt>
                  <dd className="mt-1 text-sm text-gray-900">{shipment.departure_center?.name || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">도착 센터</dt>
                  <dd className="mt-1 text-sm text-gray-900">{shipment.arrival_center?.name || '-'}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">출하 품목</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">품목명</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">품질</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수량</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">단가</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">금액</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shipment.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.product_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{qualityToString(item.quality)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.unit_price.toLocaleString()}원</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.total_price.toLocaleString()}원</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      총계
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {totalPrice.toLocaleString()}원
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {shipment.notes && (
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">비고</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{shipment.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetail;