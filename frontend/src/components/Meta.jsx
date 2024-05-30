import { Helmet } from "react-helmet-async";

const Meta = ({
  title = "welcome to proShop",
  description = "We sell the best products for cheap",
  keywords = "electronics, buy electronics, cheap electronics",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="descrption" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

export default Meta;
