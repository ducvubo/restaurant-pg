import { Payment, columns } from './columns'
import { DataTable } from './data-table'

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com'
    },
    {
      id: '82e7df29',
      amount: 250,
      status: 'completed',
      email: 'a@example.com'
    },
    {
      id: '4fd2ce89',
      amount: 500,
      status: 'failed',
      email: 'b@example.com'
    },
    {
      id: '1ae3dcb8',
      amount: 300,
      status: 'pending',
      email: 'c@example.com'
    },
    {
      id: '82e7df29',
      amount: 250,
      status: 'completed',
      email: 'a@example.com'
    },
    {
      id: '4fd2ce89',
      amount: 500,
      status: 'failed',
      email: 'b@example.com'
    },
    {
      id: '1ae3dcb8',
      amount: 300,
      status: 'pending',
      email: 'c@example.com'
    },
    {
      id: '82e7df29',
      amount: 250,
      status: 'completed',
      email: 'a@example.com'
    },
    {
      id: '4fd2ce89',
      amount: 500,
      status: 'failed',
      email: 'b@example.com'
    },
    {
      id: '1ae3dcb8',
      amount: 300,
      status: 'pending',
      email: 'c@example.com'
    },
    {
      id: '82e7df29',
      amount: 250,
      status: 'completed',
      email: 'a@example.com'
    },
    {
      id: '4fd2ce89',
      amount: 500,
      status: 'failed',
      email: 'b@example.com'
    },
    {
      id: '1ae3dcb8',
      amount: 300,
      status: 'pending',
      email: 'c@example.com'
    }
  ]
}

export default async function PageEmployees() {
  const data = await getData()

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
