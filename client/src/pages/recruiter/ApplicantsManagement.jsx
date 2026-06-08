import { useEffect, useState } from "react";
import api from "@/utils/api";

import RecruiterHeader from "@/components/recruiter/RecruiterHeader";
import SearchFilter from "@/components/recruiter/SearchFilter";
import ApplicantTable from "@/components/recruiter/ApplicantTable";

const ApplicantsManagement = () => {
  const [applicants, setApplicants] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchApplicants = async () => {
      const res = await api.get("/recruiter/applicants");

      setApplicants(res.data.applicants);
    };

    fetchApplicants();
  }, []);

  const filteredApplicants = applicants.filter((app) =>
    app.applicant.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <RecruiterHeader title="Applicants" subtitle="Manage applicants" />

      <SearchFilter
        value={search}
        onChange={setSearch}
        placeholder="Search applicants..."
      />

      <div className="mt-6">
        <ApplicantTable applicants={filteredApplicants} />
      </div>
    </>
  );
};

export default ApplicantsManagement;
