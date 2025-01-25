
// const NotFound = () => {
//   return (
//     <div>
//       <h1>Not Found</h1>
//     </div>
//   )
// }

// export default NotFound

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-2xl text-gray-700 mt-4">Page Not Found</p>
      <a
        href="/login"
        className="mt-6 px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default NotFound;
