import Head from "next/head";

const PageTitle = ({ title, description }) => {
  return (
    <Head>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
    </Head>
  );
};

export default PageTitle;
