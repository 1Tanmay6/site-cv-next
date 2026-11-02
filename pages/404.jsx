import Head from "next/head";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="h-full bg-primary/30">
      <Head>
        <title>Page not found | Tanmay Patil</title>
      </Head>
      <div className="container flex flex-col items-center justify-center h-full mx-auto text-center gap-y-6">
        <h1 className="h1">404</h1>
        <p>This page could not be found.</p>
        <Link
          href="/"
          className="btn rounded-full border border-white/50 px-8 flex items-center justify-center transition-all duration-300 hover:border-accent"
        >
          Back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
