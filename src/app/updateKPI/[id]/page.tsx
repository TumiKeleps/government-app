// updateKPI/[id]/page.tsx

import UpdateKPIClient from './updateKPIClient';

interface Params {
  params: { id: string };
}

export default async function UpdateKPIPage({ params }: Params) {
  const { id } = params;

  // Perform data fetching on the server
  const response = await fetch(`http://192.168.8.6:8034/api/perfomance-indicators/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'opt-key-dev-2024',
    },
    cache: 'no-store', // To prevent caching issues
  });

  if (!response.ok) {
    // Throw an error to be caught by error.tsx
    throw new Error('Failed to fetch data');
  }

  const data = await response.json();

  // Pass data to the Client Component
  return <UpdateKPIClient data={data} />;
}
