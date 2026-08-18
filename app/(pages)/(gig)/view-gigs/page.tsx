import DisplayAllGigs from "@/components/DisplayAllGigs"
import GigFilters from "@/components/gigs/GigFilters"
import { getAllUniqueSkills } from "../services/gigService";

export default async function ViewGigs({
  searchParams
}: {
  searchParams: Promise<{ page?: string, search?: string, skill?: string, sort?: string }>
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const currentSearch = params.search || "";
  const currentSkill = params.skill || "";
  const currentSort = params.sort || "";

  // Fetch all unique skills currently present in active gigs
  const availableSkills = await getAllUniqueSkills();

  return (
    <div className="w-full min-h-screen bg-background p-4 sm:p-6 sm:py-10">
      <div className="max-w-7xl mx-auto space-y-6">

        <GigFilters
          availableSkills={availableSkills}
          currentSearch={currentSearch}
          currentSkill={currentSkill}
          currentSort={currentSort}
        />

        <DisplayAllGigs page={currentPage} search={currentSearch} skill={currentSkill} sort={currentSort} />
      </div>
    </div>
  )
}
