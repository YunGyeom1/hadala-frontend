import { ShipmentSummary } from './types';
import { ProductQuality } from '../common/types';

export const mockShipmentSummary: ShipmentSummary = {
  rows: [
    // 당근 데이터
    {
      shipment_date: '2024-03-20',
      center_name: '서울 물류센터',
      product_name: '당근',
      shipment_type: '일반',
      quality: ProductQuality.A,
      quantity: 5000,
      destination: '서울시 강남구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '부산 물류센터',
      product_name: '당근',
      shipment_type: '일반',
      quality: ProductQuality.A,
      quantity: 3500,
      destination: '부산시 해운대구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '대구 물류센터',
      product_name: '당근',
      shipment_type: '일반',
      quality: ProductQuality.A,
      quantity: 2800,
      destination: '대구시 수성구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '서울 물류센터',
      product_name: '당근',
      shipment_type: '일반',
      quality: ProductQuality.B,
      quantity: 3000,
      destination: '서울시 강남구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '부산 물류센터',
      product_name: '당근',
      shipment_type: '일반',
      quality: ProductQuality.B,
      quantity: 2500,
      destination: '부산시 해운대구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '대구 물류센터',
      product_name: '당근',
      shipment_type: '일반',
      quality: ProductQuality.B,
      quantity: 1800,
      destination: '대구시 수성구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '서울 물류센터',
      product_name: '당근',
      shipment_type: '일반',
      quality: ProductQuality.C,
      quantity: 1500,
      destination: '서울시 강남구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '부산 물류센터',
      product_name: '당근',
      shipment_type: '일반',
      quality: ProductQuality.C,
      quantity: 1200,
      destination: '부산시 해운대구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '대구 물류센터',
      product_name: '당근',
      shipment_type: '일반',
      quality: ProductQuality.C,
      quantity: 900,
      destination: '대구시 수성구'
    },

    // 양배추 데이터
    {
      shipment_date: '2024-03-20',
      center_name: '서울 물류센터',
      product_name: '양배추',
      shipment_type: '일반',
      quality: ProductQuality.A,
      quantity: 800,
      destination: '서울시 강남구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '부산 물류센터',
      product_name: '양배추',
      shipment_type: '일반',
      quality: ProductQuality.A,
      quantity: 600,
      destination: '부산시 해운대구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '대구 물류센터',
      product_name: '양배추',
      shipment_type: '일반',
      quality: ProductQuality.A,
      quantity: 500,
      destination: '대구시 수성구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '서울 물류센터',
      product_name: '양배추',
      shipment_type: '일반',
      quality: ProductQuality.B,
      quantity: 500,
      destination: '서울시 강남구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '부산 물류센터',
      product_name: '양배추',
      shipment_type: '일반',
      quality: ProductQuality.B,
      quantity: 400,
      destination: '부산시 해운대구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '대구 물류센터',
      product_name: '양배추',
      shipment_type: '일반',
      quality: ProductQuality.B,
      quantity: 300,
      destination: '대구시 수성구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '서울 물류센터',
      product_name: '양배추',
      shipment_type: '일반',
      quality: ProductQuality.C,
      quantity: 300,
      destination: '서울시 강남구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '부산 물류센터',
      product_name: '양배추',
      shipment_type: '일반',
      quality: ProductQuality.C,
      quantity: 200,
      destination: '부산시 해운대구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '대구 물류센터',
      product_name: '양배추',
      shipment_type: '일반',
      quality: ProductQuality.C,
      quantity: 150,
      destination: '대구시 수성구'
    },

    // 파 데이터
    {
      shipment_date: '2024-03-20',
      center_name: '서울 물류센터',
      product_name: '파',
      shipment_type: '일반',
      quality: ProductQuality.A,
      quantity: 2000,
      destination: '서울시 강남구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '부산 물류센터',
      product_name: '파',
      shipment_type: '일반',
      quality: ProductQuality.A,
      quantity: 1500,
      destination: '부산시 해운대구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '서울 물류센터',
      product_name: '파',
      shipment_type: '일반',
      quality: ProductQuality.B,
      quantity: 1200,
      destination: '서울시 강남구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '부산 물류센터',
      product_name: '파',
      shipment_type: '일반',
      quality: ProductQuality.B,
      quantity: 900,
      destination: '부산시 해운대구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '서울 물류센터',
      product_name: '파',
      shipment_type: '일반',
      quality: ProductQuality.C,
      quantity: 600,
      destination: '서울시 강남구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '부산 물류센터',
      product_name: '파',
      shipment_type: '일반',
      quality: ProductQuality.C,
      quantity: 400,
      destination: '부산시 해운대구'
    },

    // 딸기 데이터
    {
      shipment_date: '2024-03-20',
      center_name: '서울 물류센터',
      product_name: '딸기',
      shipment_type: '일반',
      quality: ProductQuality.A,
      quantity: 3000,
      destination: '서울시 강남구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '부산 물류센터',
      product_name: '딸기',
      shipment_type: '일반',
      quality: ProductQuality.A,
      quantity: 2500,
      destination: '부산시 해운대구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '대구 물류센터',
      product_name: '딸기',
      shipment_type: '일반',
      quality: ProductQuality.A,
      quantity: 2000,
      destination: '대구시 수성구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '서울 물류센터',
      product_name: '딸기',
      shipment_type: '일반',
      quality: ProductQuality.B,
      quantity: 1800,
      destination: '서울시 강남구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '부산 물류센터',
      product_name: '딸기',
      shipment_type: '일반',
      quality: ProductQuality.B,
      quantity: 1500,
      destination: '부산시 해운대구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '대구 물류센터',
      product_name: '딸기',
      shipment_type: '일반',
      quality: ProductQuality.B,
      quantity: 1200,
      destination: '대구시 수성구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '서울 물류센터',
      product_name: '딸기',
      shipment_type: '일반',
      quality: ProductQuality.C,
      quantity: 900,
      destination: '서울시 강남구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '부산 물류센터',
      product_name: '딸기',
      shipment_type: '일반',
      quality: ProductQuality.C,
      quantity: 700,
      destination: '부산시 해운대구'
    },
    {
      shipment_date: '2024-03-20',
      center_name: '대구 물류센터',
      product_name: '딸기',
      shipment_type: '일반',
      quality: ProductQuality.C,
      quantity: 500,
      destination: '대구시 수성구'
    }
  ]
};
