import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/prisma/client';
import TutorRequests from '@/components/TutorRequests';

export default async function TutorProfile({ searchParams }: { searchParams: { page: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const page = parseInt(searchParams.page || '1', 10); // Get the current page or default to page 1
  const pageSize = 10; // Number of requests per page

  // Fetch total count of processed requests
  const totalRequests = await prisma.processedRequest.count({
    where: {
      tutorId: session.user.id,
    },
  });

  const totalPages = Math.ceil(totalRequests / pageSize); // Calculate total number of pages

  // Fetch the processed requests for the current page
  const processedRequests = await prisma.processedRequest.findMany({
    where: {
      tutorId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: (page - 1) * pageSize, // Skip records based on the current page
    take: pageSize, // Fetch only 10 records
  });

  // Calculate metrics (Convert times from seconds to minutes)
  const waitTimesInMinutes = processedRequests.map((req) => Math.round(req.waitTime / 60));
  const helpTimesInMinutes = processedRequests.map((req) => Math.round(req.helpTime / 60));

  const calculateAverage = (times: number[]) => (times.length === 0 ? 0 : Math.round(times.reduce((sum, time) => sum + time, 0) / times.length));

  const calculateMedian = (times: number[]) => {
    if (times.length === 0) return 0;
    const sorted = [...times].sort((a, b) => a - b);
    const middleIndex = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? Math.round((sorted[middleIndex - 1] + sorted[middleIndex]) / 2) : sorted[middleIndex];
  };

  const averageWaitTime = calculateAverage(waitTimesInMinutes);
  const averageHelpTime = calculateAverage(helpTimesInMinutes);
  const medianWaitTime = calculateMedian(waitTimesInMinutes);
  const medianHelpTime = calculateMedian(helpTimesInMinutes);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Tutor Profile</h1>

      {/* Display Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Metrics</h2>
        <ul>
          <li><strong>Average Wait Time:</strong> {averageWaitTime} minutes</li>
          <li><strong>Average Help Time:</strong> {averageHelpTime} minutes</li>
          <li><strong>Median Wait Time:</strong> {medianWaitTime} minutes</li>
          <li><strong>Median Help Time:</strong> {medianHelpTime} minutes</li>
        </ul>
      </div>

      {/* Pass data to the client component */}
      <TutorRequests processedRequests={processedRequests} totalPages={totalPages} currentPage={page} />
    </div>
  );
}
