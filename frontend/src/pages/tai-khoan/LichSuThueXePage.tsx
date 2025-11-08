'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EyeIcon, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Rental {
  id: string | number;
  user_id: string | number;
  vehicle_id: string | number;
  payment_id: string | number;
  start_station_id: string | number;
  end_station_id: string | number;
  start_date: string;
  end_date: string;
  total_amount: number;
  calculated_price_details: string;
  deposit_amount: number;
  status: string;
}

const fakeRentals: Rental[] = [
  {
    id: 1,
    user_id: 101,
    vehicle_id: 201,
    payment_id: 301,
    start_station_id: 401,
    end_station_id: 402,
    start_date: '2025-11-01T08:00:00Z',
    end_date: '2025-11-01T10:30:00Z',
    total_amount: 150.75,
    calculated_price_details: '{"base":100,"time_fee":30.75,"tax":20}',
    deposit_amount: 50,
    status: 'completed',
  },
  {
    id: 2,
    user_id: 102,
    vehicle_id: 202,
    payment_id: 302,
    start_station_id: 401,
    end_station_id: 403,
    start_date: '2025-11-02T09:00:00Z',
    end_date: '2025-11-02T12:15:00Z',
    total_amount: 210.5,
    calculated_price_details: '{"base":150,"time_fee":40.5,"tax":20}',
    deposit_amount: 70,
    status: 'completed',
  },
  {
    id: 3,
    user_id: 103,
    vehicle_id: 203,
    payment_id: 303,
    start_station_id: 404,
    end_station_id: 405,
    start_date: '2025-11-03T07:30:00Z',
    end_date: '2025-11-03T09:00:00Z',
    total_amount: 120.0,
    calculated_price_details: '{"base":90,"time_fee":20,"tax":10}',
    deposit_amount: 40,
    status: 'cancelled',
  },
  {
    id: 4,
    user_id: 104,
    vehicle_id: 204,
    payment_id: 304,
    start_station_id: 401,
    end_station_id: 401,
    start_date: '2025-11-04T14:00:00Z',
    end_date: '2025-11-04T15:00:00Z',
    total_amount: 85.0,
    calculated_price_details: '{"base":60,"time_fee":15,"tax":10}',
    deposit_amount: 30,
    status: 'completed',
  },
  {
    id: 5,
    user_id: 105,
    vehicle_id: 205,
    payment_id: 305,
    start_station_id: 406,
    end_station_id: 407,
    start_date: '2025-11-05T11:15:00Z',
    end_date: '2025-11-05T13:45:00Z',
    total_amount: 175.25,
    calculated_price_details: '{"base":120,"time_fee":35.25,"tax":20}',
    deposit_amount: 60,
    status: 'completed',
  },
  {
    id: 6,
    user_id: 106,
    vehicle_id: 206,
    payment_id: 306,
    start_station_id: 408,
    end_station_id: 409,
    start_date: '2025-11-06T08:00:00Z',
    end_date: '2025-11-06T11:00:00Z',
    total_amount: 200.0,
    calculated_price_details: '{"base":150,"time_fee":30,"tax":20}',
    deposit_amount: 50,
    status: 'pending',
  },
  {
    id: 7,
    user_id: 107,
    vehicle_id: 207,
    payment_id: 307,
    start_station_id: 410,
    end_station_id: 410,
    start_date: '2025-11-07T16:00:00Z',
    end_date: '2025-11-07T18:30:00Z',
    total_amount: 190.0,
    calculated_price_details: '{"base":140,"time_fee":30,"tax":20}',
    deposit_amount: 60,
    status: 'completed',
  },
  {
    id: 8,
    user_id: 108,
    vehicle_id: 208,
    payment_id: 308,
    start_station_id: 411,
    end_station_id: 412,
    start_date: '2025-11-08T10:00:00Z',
    end_date: '2025-11-08T12:00:00Z',
    total_amount: 160.5,
    calculated_price_details: '{"base":120,"time_fee":20.5,"tax":20}',
    deposit_amount: 50,
    status: 'completed',
  },
  {
    id: 9,
    user_id: 109,
    vehicle_id: 209,
    payment_id: 309,
    start_station_id: 413,
    end_station_id: 414,
    start_date: '2025-11-09T13:30:00Z',
    end_date: '2025-11-09T15:45:00Z',
    total_amount: 175.0,
    calculated_price_details: '{"base":130,"time_fee":25,"tax":20}',
    deposit_amount: 55,
    status: 'in_progress',
  },
  {
    id: 10,
    user_id: 110,
    vehicle_id: 210,
    payment_id: 310,
    start_station_id: 415,
    end_station_id: 416,
    start_date: '2025-11-10T07:00:00Z',
    end_date: '2025-11-10T09:00:00Z',
    total_amount: 140.25,
    calculated_price_details: '{"base":100,"time_fee":20.25,"tax":20}',
    deposit_amount: 45,
    status: 'completed',
  },
  {
    id: 11,
    user_id: 111,
    vehicle_id: 211,
    payment_id: 311,
    start_station_id: 417,
    end_station_id: 418,
    start_date: '2025-11-11T09:00:00Z',
    end_date: '2025-11-11T10:30:00Z',
    total_amount: 110.0,
    calculated_price_details: '{"base":80,"time_fee":20,"tax":10}',
    deposit_amount: 35,
    status: 'completed',
  },
  {
    id: 12,
    user_id: 112,
    vehicle_id: 212,
    payment_id: 312,
    start_station_id: 419,
    end_station_id: 419,
    start_date: '2025-11-12T10:00:00Z',
    end_date: '2025-11-12T11:15:00Z',
    total_amount: 95.5,
    calculated_price_details: '{"base":70,"time_fee":15.5,"tax":10}',
    deposit_amount: 30,
    status: 'completed',
  },
  {
    id: 13,
    user_id: 113,
    vehicle_id: 213,
    payment_id: 313,
    start_station_id: 420,
    end_station_id: 421,
    start_date: '2025-11-13T08:30:00Z',
    end_date: '2025-11-13T10:45:00Z',
    total_amount: 155.0,
    calculated_price_details: '{"base":110,"time_fee":25,"tax":20}',
    deposit_amount: 50,
    status: 'completed',
  },
  {
    id: 14,
    user_id: 114,
    vehicle_id: 214,
    payment_id: 314,
    start_station_id: 422,
    end_station_id: 423,
    start_date: '2025-11-14T12:00:00Z',
    end_date: '2025-11-14T14:30:00Z',
    total_amount: 185.0,
    calculated_price_details: '{"base":130,"time_fee":35,"tax":20}',
    deposit_amount: 60,
    status: 'completed',
  },
  {
    id: 15,
    user_id: 115,
    vehicle_id: 215,
    payment_id: 315,
    start_station_id: 424,
    end_station_id: 425,
    start_date: '2025-11-15T09:45:00Z',
    end_date: '2025-11-15T11:00:00Z',
    total_amount: 120.5,
    calculated_price_details: '{"base":90,"time_fee":20.5,"tax":10}',
    deposit_amount: 40,
    status: 'completed',
  },
  {
    id: 16,
    user_id: 116,
    vehicle_id: 216,
    payment_id: 316,
    start_station_id: 426,
    end_station_id: 427,
    start_date: '2025-11-16T08:00:00Z',
    end_date: '2025-11-16T09:30:00Z',
    total_amount: 115.0,
    calculated_price_details: '{"base":85,"time_fee":20,"tax":10}',
    deposit_amount: 35,
    status: 'completed',
  },
  {
    id: 17,
    user_id: 117,
    vehicle_id: 217,
    payment_id: 317,
    start_station_id: 428,
    end_station_id: 429,
    start_date: '2025-11-17T07:30:00Z',
    end_date: '2025-11-17T09:00:00Z',
    total_amount: 130.0,
    calculated_price_details: '{"base":100,"time_fee":20,"tax":10}',
    deposit_amount: 40,
    status: 'cancelled',
  },
  {
    id: 18,
    user_id: 118,
    vehicle_id: 218,
    payment_id: 318,
    start_station_id: 430,
    end_station_id: 431,
    start_date: '2025-11-18T11:00:00Z',
    end_date: '2025-11-18T13:30:00Z',
    total_amount: 175.75,
    calculated_price_details: '{"base":130,"time_fee":25.75,"tax":20}',
    deposit_amount: 55,
    status: 'completed',
  },
  {
    id: 19,
    user_id: 119,
    vehicle_id: 219,
    payment_id: 319,
    start_station_id: 432,
    end_station_id: 433,
    start_date: '2025-11-19T14:00:00Z',
    end_date: '2025-11-19T16:45:00Z',
    total_amount: 195.0,
    calculated_price_details: '{"base":150,"time_fee":25,"tax":20}',
    deposit_amount: 60,
    status: 'in_progress',
  },
  {
    id: 20,
    user_id: 120,
    vehicle_id: 220,
    payment_id: 320,
    start_station_id: 434,
    end_station_id: 435,
    start_date: '2025-11-20T09:00:00Z',
    end_date: '2025-11-20T11:30:00Z',
    total_amount: 170.25,
    calculated_price_details: '{"base":120,"time_fee":30.25,"tax":20}',
    deposit_amount: 55,
    status: 'completed',
  },
];

export function LichSuThueXePage() {
  const navigate = useNavigate();
  // const { data: rentals, isLoading } = useRentals();
  const isLoading = false;
  const rentals = fakeRentals;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Lịch sử thuê xe</h2>
        <Button
          onClick={() => navigate('/thue-xe-tu-lai')}
          className='gap-2'
          style={{
            background: 'var(--color-blue-600)',
            cursor: 'pointer',
          }}
        >
          <Plus className='w-4 h-4' /> Thuê xe
        </Button>
      </div>

      {isLoading ? (
        <div className='text-center py-8'>Đang tải...</div>
      ) : (
        <div className='border rounded-lg overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Vehicle ID</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Deposit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className='text-center py-8 text-muted-foreground'
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                rentals.map((rental: Rental) => (
                  <TableRow key={rental.id}>
                    <TableCell>{rental.user_id}</TableCell>
                    <TableCell>{rental.vehicle_id}</TableCell>
                    <TableCell className='text-sm'>
                      {new Date(rental.start_date).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className='text-sm'>
                      {new Date(rental.end_date).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      {Number(rental.total_amount).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </TableCell>
                    <TableCell>
                      {Number(rental.deposit_amount).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          rental.status
                        )}`}
                      >
                        {rental.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={'outline'}
                        className='cursor-pointer'
                        onClick={() =>
                          navigate(`/tai-khoan/lich-su-thue/${rental.id}`)
                        }
                      >
                        <EyeIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
