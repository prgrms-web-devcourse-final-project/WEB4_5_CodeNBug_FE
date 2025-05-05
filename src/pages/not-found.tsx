import { Link, useRouteError, isRouteErrorResponse } from "react-router";

export const RouteErrorPage = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-col items-center gap-2 py-24">
        <h1 className="text-4xl font-bold">{error.status}</h1>
        <p className="text-gray-500">{error.statusText}</p>
        <Link
          to="/"
          className="mt-6 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 py-24">
      <h1 className="text-3xl font-bold">예상치 못한 오류가 발생했습니다</h1>
      <pre className="text-sm text-red-500 whitespace-pre-wrap">
        {(error as Error)?.message || String(error)}
      </pre>
      <Link
        to="/"
        className="mt-6 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
};
