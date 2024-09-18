import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/prisma/client';

export default async function TutorProfile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const calculateAverage = (times: number[]) => {
    if (times.length === 0) return 0;
    const total = times.reduce((sum, time) => sum + time, 0);
    return Math.round(total / times.length);
  };

  const calculateMedian = (times: number[]) => {
    if (times.length === 0) return 0;
    const sorted = [...times].sort((a, b) => a - b);
    const middleIndex = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return Math.round((sorted[middleIndex - 1] + sorted[middleIndex]) / 2);
    } else {
      return sorted[middleIndex];
    }
  };

  // Fetch processed requests for the logged-in tutor
  const processedRequests = await prisma.processedRequest.findMany({
    where: {
      tutorId: session.user.id, // Assuming the user's session includes the tutorId
    },
    orderBy: {
      createdAt: 'desc', // Order by latest processed requests
    },
  });

  // Calculate metrics
  const waitTimes = processedRequests.map((req) => req.waitTime);
  const helpTimes = processedRequests.map((req) => req.helpTime);

  const averageWaitTime = calculateAverage(waitTimes);
  const averageHelpTime = calculateAverage(helpTimes);
  const medianWaitTime = calculateMedian(waitTimes);
  const medianHelpTime = calculateMedian(helpTimes);

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

      {/* Display Processed Requests in a Table */}
      <table className="min-w-full table-auto bg-white rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Student Name</th>
            <th className="px-4 py-2">Course</th>
            <th className="px-4 py-2">Question</th>
            <th className="px-4 py-2">Wait Time (min)</th>
            <th className="px-4 py-2">Help Time (min)</th>
            <th className="px-4 py-2">Processed At</th>
          </tr>
        </thead>
        <tbody>
          {processedRequests.map((request) => (
            <tr key={request.id}>
              <td className="border px-4 py-2">{request.studentName}</td>
              <td className="border px-4 py-2">{request.course}</td>
              <td className="border px-4 py-2">{request.question}</td>
              <td className="border px-4 py-2">{request.waitTime}</td>
              <td className="border px-4 py-2">{request.helpTime}</td>
              <td className="border px-4 py-2">{new Date(request.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
