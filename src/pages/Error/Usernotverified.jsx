import { getAuth } from "firebase/auth";

const Usernotverified = () => {
  const auth = getAuth();
  const handleMail = () => {
    if (auth.currentUser.email.split("@")[1].split(".")[0] == "outlook") {
      window.open(
        "https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=173&ct=1742549716&rver=7.5.2211.0&wp=MBI_SSL&wreply=https%3a%2f%2foutlook.live.com%2fowa%2f%3fnlp%3d1%26cobrandid%3dab0455a0-8d03-46b9-b18b-df2f57b9e44c%26culture%3den-us%26country%3dus%26RpsCsrfState%3d1e91a1bb-203a-1031-8ef1-5cfd4154db55&id=292841&aadredir=1&CBCXT=out&lw=1&fl=dob%2cflname%2cwld&cobrandid=ab0455a0-8d03-46b9-b18b-df2f57b9e44c",
        "_blank"
      );
    } else if (auth.currentUser.email.split("@")[1].split(".")[0] == "gmail") {
      window.open(
        "https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox",
        "_blank"
      );
    }else{
          window.open("https://mail.yahoo.com/", "_blank");
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mb-8">
            <h2 className="mt-6 text-6xl font-extrabold text-gray-900 dark:text-gray-100">
              404
            </h2>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
              Verify Your Mail
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sorry, we couldn't find the page you're looking for.
            </p>
          </div>
          <div className="mt-8">
            <span
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleMail}
            >
              <svg
                className="mr-2 -ml-1 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12h18m-9-9l9 9-9 9"
                />
              </svg>
              Go back Mailbox
            </span>
          </div>
        </div>
        <div className="mt-16 w-full max-w-2xl">
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-gray-100 dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
                If you think this is a mistake, please contact support
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Usernotverified;
