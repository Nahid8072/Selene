import { useState } from "react";
import { Pagination } from "@sakaniui/react";

export function SamplePager({ total = 1 }: { total?: number }) {
  const [page, setPage] = useState(1);
  return (
    <div className="sample-pager">
      <p className="section-note">All sample rows are on this page. Changing the page does not load more data.</p>
      <Pagination total={total} page={page} onPageChange={setPage} />
    </div>
  );
}
