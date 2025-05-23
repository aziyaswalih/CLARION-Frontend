import Header from "../components/beneficiary/Header/Header";
import LatestCauses from "../components/beneficiary/LatestCauses";

function RecentCases() {
  return (
    <>
      <Header />
      <div className="container mx-auto py-20 px-4 bg-[#ffffff]">
        <LatestCauses />
      </div>
    </>
  );
}

export default RecentCases;
