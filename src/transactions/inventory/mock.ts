import { InventorySnapshotResponse } from './types';
import { ProductQuality } from '../common/types';

export const mockInventorySnapshot: InventorySnapshotResponse = {
  rows: [
    {
      snapshot_date: '2024-06-15',
      centers: [
        {
          center_id: '1',
          center_name: '서울 물류센터',
          total_quantity: 15000,
          total_price: 45000000,
          items: [
            {
              product_name: '당근',
              quality: ProductQuality.A,
              quantity: 5000,
              unit_price: 3000,
              total_price: 15000000
            },
            {
              product_name: '당근',
              quality: ProductQuality.B,
              quantity: 3000,
              unit_price: 2000,
              total_price: 6000000
            },
            {
              product_name: '당근',
              quality: ProductQuality.C,
              quantity: 1500,
              unit_price: 1000,
              total_price: 1500000
            },
            {
              product_name: '양배추',
              quality: ProductQuality.A,
              quantity: 800,
              unit_price: 4000,
              total_price: 3200000
            },
            {
              product_name: '양배추',
              quality: ProductQuality.B,
              quantity: 500,
              unit_price: 3000,
              total_price: 1500000
            },
            {
              product_name: '양배추',
              quality: ProductQuality.C,
              quantity: 300,
              unit_price: 2000,
              total_price: 600000
            }
          ]
        },
        {
          center_id: '2',
          center_name: '부산 물류센터',
          total_quantity: 12000,
          total_price: 36000000,
          items: [
            {
              product_name: '당근',
              quality: ProductQuality.A,
              quantity: 3500,
              unit_price: 3000,
              total_price: 10500000
            },
            {
              product_name: '당근',
              quality: ProductQuality.B,
              quantity: 2500,
              unit_price: 2000,
              total_price: 5000000
            },
            {
              product_name: '당근',
              quality: ProductQuality.C,
              quantity: 1200,
              unit_price: 1000,
              total_price: 1200000
            },
            {
              product_name: '양배추',
              quality: ProductQuality.A,
              quantity: 600,
              unit_price: 4000,
              total_price: 2400000
            },
            {
              product_name: '양배추',
              quality: ProductQuality.B,
              quantity: 400,
              unit_price: 3000,
              total_price: 1200000
            },
            {
              product_name: '양배추',
              quality: ProductQuality.C,
              quantity: 200,
              unit_price: 2000,
              total_price: 400000
            }
          ]
        },
        {
          center_id: '3',
          center_name: '대구 물류센터',
          total_quantity: 10000,
          total_price: 30000000,
          items: [
            {
              product_name: '당근',
              quality: ProductQuality.A,
              quantity: 2800,
              unit_price: 3000,
              total_price: 8400000
            },
            {
              product_name: '당근',
              quality: ProductQuality.B,
              quantity: 1800,
              unit_price: 2000,
              total_price: 3600000
            },
            {
              product_name: '당근',
              quality: ProductQuality.C,
              quantity: 900,
              unit_price: 1000,
              total_price: 900000
            },
            {
              product_name: '양배추',
              quality: ProductQuality.A,
              quantity: 500,
              unit_price: 4000,
              total_price: 2000000
            },
            {
              product_name: '양배추',
              quality: ProductQuality.B,
              quantity: 300,
              unit_price: 3000,
              total_price: 900000
            },
            {
              product_name: '양배추',
              quality: ProductQuality.C,
              quantity: 150,
              unit_price: 2000,
              total_price: 300000
            }
          ]
        }
      ]
    },
    {
      snapshot_date: '2024-03-19',
      centers: [
        {
          center_id: '1',
          center_name: '서울 물류센터',
          total_quantity: 14000,
          total_price: 42000000,
          items: [
            {
              product_name: '당근',
              quality: ProductQuality.A,
              quantity: 4800,
              unit_price: 3000,
              total_price: 14400000
            },
            {
              product_name: '당근',
              quality: ProductQuality.B,
              quantity: 2800,
              unit_price: 2000,
              total_price: 5600000
            },
            {
              product_name: '당근',
              quality: ProductQuality.C,
              quantity: 1400,
              unit_price: 1000,
              total_price: 1400000
            },
            {
              product_name: '양배추',
              quality: ProductQuality.A,
              quantity: 750,
              unit_price: 4000,
              total_price: 3000000
            },
            {
              product_name: '양배추',
              quality: ProductQuality.B,
              quantity: 450,
              unit_price: 3000,
              total_price: 1350000
            },
            {
              product_name: '양배추',
              quality: ProductQuality.C,
              quantity: 280,
              unit_price: 2000,
              total_price: 560000
            }
          ]
        },
        {
          center_id: '2',
          center_name: '부산 물류센터',
          total_quantity: 11000,
          total_price: 33000000,
          items: [
            {
              product_name: '당근',
              quality: ProductQuality.A,
              quantity: 3200,
              unit_price: 3000,
              total_price: 9600000
            },
            {
              product_name: '당근',
              quality: ProductQuality.B,
              quantity: 2200,
              unit_price: 2000,
              total_price: 4400000
            },
            {
              product_name: '당근',
              quality: ProductQuality.C,
              quantity: 1100,
              unit_price: 1000,
              total_price: 1100000
            },
            {
              product_name: '양배추',
              quality: ProductQuality.A,
              quantity: 550,
              unit_price: 4000,
              total_price: 2200000
            },
            {
              product_name: '양배추',
              quality: ProductQuality.B,
              quantity: 350,
              unit_price: 3000,
              total_price: 1050000
            },
            {
              product_name: '양배추',
              quality: ProductQuality.C,
              quantity: 180,
              unit_price: 2000,
              total_price: 360000
            }
          ]
        }
      ]
    }
  ]
}; 