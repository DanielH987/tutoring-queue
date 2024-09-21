'use client';

import { useRouter } from 'next/navigation';
import { ProcessedRequestType } from '@/app/types';

export default function TutorRequests({ processedRequests, totalPages, currentPage }: { processedRequests: ProcessedRequestType[], totalPages: number, currentPage: number }) {
  const router = useRouter();

  const goToPage = (page: number) => {
    router.push(`?page=${page}`);
  };

  return (
    <>
      {/* Display Processed Requests in a Table */}
      <table className="min-w-full table-auto bg-white rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-800">
            <th className="px-4 py-2">Student Name</th>
            <th className="px-4 py-2">Course</th>
            <th className="px-4 py-2">Question</th>
            <th className="px-4 py-2">Wait Time (min)</th>
            <th className="px-4 py-2">Help Time (min)</th>
            <th className="px-4 py-2">Processed At</th>
          </tr>
        </thead>
        <tbody className='dark:bg-gray-700'>
          {processedRequests.map((request) => (
            <tr key={request.id}>
              <td className="border px-4 py-2">{request.studentName}</td>
              <td className="border px-4 py-2">{request.course}</td>
              <td className="border px-4 py-2">{request.question}</td>
              <td className="border px-4 py-2">{(request.waitTime / 60).toFixed(2)}</td>
              <td className="border px-4 py-2">{(request.helpTime / 60).toFixed(2)}</td>
              <td className="border px-4 py-2">{new Date(request.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 pb-12">
        <button
          className="custom-bg-color text-white py-2 px-4 rounded-lg disabled:opacity-50"
          disabled={currentPage <= 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          Previous
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button
          className="custom-bg-color text-white py-2 px-4 rounded-lg disabled:opacity-50"
          disabled={currentPage >= totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
}
