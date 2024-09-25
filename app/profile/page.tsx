import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/config/authOptions';
import prisma from '@/prisma/client';
import TutorRequests from '@/components/TutorRequests';
import { StatusType } from '../types'; // Import your custom StatusType enum

export default async function TutorProfile({ searchParams }: { searchParams: { page: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const page = parseInt(searchParams.page || '1', 10); // Get the current page or default to page 1
  const pageSize = 10; // Number of requests per page

  // Fetch tutor's profile
  const tutorProfile = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

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
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      tutor: {
        include: {
          ProcessedRequest: true, // Include the processed requests for the tutor
        },
      },
    },
  });

  // Map tutor status and convert Date fields to strings
  const mappedProcessedRequests = processedRequests.map(request => ({
    ...request,
    tutor: {
      ...request.tutor,
      status: request.tutor.status as StatusType, // Explicitly cast or map to custom StatusType
      createdAt: request.tutor.createdAt.toISOString(), // Convert Date to string
      ProcessedRequest: request.tutor.ProcessedRequest.map(pr => ({
        ...pr,
        createdAt: pr.createdAt.toISOString(), // Convert Date to string in ProcessedRequest
      })),
    },
    createdAt: request.createdAt.toISOString(), // Convert Date to string in the main object
  }));

  // Calculate metrics (Convert times from seconds to minutes)
  const waitTimesInMinutes = mappedProcessedRequests.map((req) => Math.round(req.waitTime / 60));
  const helpTimesInMinutes = mappedProcessedRequests.map((req) => Math.round(req.helpTime / 60));

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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Tutor Profile</h1>

      {/* Display Tutor Profile Info */}
      <div className="mb-10 p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Profile Information</h2>
        <ul className="space-y-3">
          <li className="flex items-center">
            <strong className="w-32 text-gray-600">Name:</strong>
            <span className="text-gray-800">{tutorProfile?.name}</span>
          </li>
          <li className="flex items-center">
            <strong className="w-32 text-gray-600">Email:</strong>
            <span className="text-gray-800">{tutorProfile?.email}</span>
          </li>
          <li className="flex items-center">
            <strong className="w-32 text-gray-600">Role:</strong>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 capitalize">{tutorProfile?.role}</span>
          </li>
          <li className="flex items-center">
            <strong className="w-32 text-gray-600">Member Since:</strong>
            <span className="text-gray-800">{new Date(tutorProfile?.createdAt).toLocaleDateString()}</span>
          </li>
        </ul>
      </div>

      {/* Display Metrics */}
      <div className="mb-10 p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Metrics</h2>
        <ul className="space-y-3">
          <li>
            <strong className="text-gray-600">Average Wait Time:</strong>
            <span className="ml-2 text-gray-800">{averageWaitTime} minutes</span>
          </li>
          <li>
            <strong className="text-gray-600">Average Help Time:</strong>
            <span className="ml-2 text-gray-800">{averageHelpTime} minutes</span>
          </li>
          <li>
            <strong className="text-gray-600">Median Wait Time:</strong>
            <span className="ml-2 text-gray-800">{medianWaitTime} minutes</span>
          </li>
          <li>
            <strong className="text-gray-600">Median Help Time:</strong>
            <span className="ml-2 text-gray-800">{medianHelpTime} minutes</span>
          </li>
        </ul>
      </div>

      {/* Pass data to the client component */}
      <TutorRequests processedRequests={mappedProcessedRequests} totalPages={totalPages} currentPage={page} />
    </div>
  );
}
