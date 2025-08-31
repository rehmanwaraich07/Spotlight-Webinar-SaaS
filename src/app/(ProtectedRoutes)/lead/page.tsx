import LeadsPage from "./_components";
import { getAllLeads } from "@/actions/leads";

const Page = async () => {
  const leads = await getAllLeads();
  return (
    <div>
      <LeadsPage initialLeads={leads} />
    </div>
  );
};

export default Page;
