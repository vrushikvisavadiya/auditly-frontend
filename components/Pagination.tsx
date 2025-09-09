import { Pagination as PaginationType } from "@/app/types";
import clsx from "clsx";
import Icon from "./Icon";

interface PaginationProps {
  pagination: PaginationType;
  loading: boolean;
  pageSizeOptions?: number[];
  onSetPageSize: (pageSize: number) => void;
  onPage: (page: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const defaultPageSizeOptions = [5, 10, 25, 50];

export default function Pagination(props: PaginationProps) {
  const { pagination, loading } = props;
  const pageSizeOptions = props.pageSizeOptions || defaultPageSizeOptions;

  function PageNumbers() {
    if (!pagination.maxPage) {
      return;
    }

    const pages: React.ReactNode[] = [];

    let startPage = Math.max(pagination.page - 2, 1);
    const lastPage = Math.min(startPage + 4, pagination.maxPage);

    const distance = lastPage - startPage;

    if (distance < 4) {
      startPage = lastPage - 4;
      if (startPage < 1) {
        startPage = 1;
      }
    }

    console.log(startPage, lastPage);

    for (let page = startPage; page <= lastPage; page++) {
      pages.push(
        <button
          key={page}
          className={clsx(
            "hidden md:inline-block",
            "rounded border px-3 py-2 border-solid",
            "text-sm not-italic font-normal leading-5",
            page === pagination.page
              ? "bg-[var(--auditly-orange)] text-white font-bold"
              : "border-[color:var(--colors-grey-4-border,#E9E9E9)] bg-white text-[#02285E]"
          )}
          onClick={() => props.onPage(page)}
          disabled={loading}
        >
          <span className=" ">{page}</span>
        </button>
      );
    }

    return pages;
  }

  if (!pagination.count) {
    return <></>;
  }

  return (
    <div className="flex flex-row justify-end items-center gap-2">
      <span>Results per page</span>
      <div className="relative">
        <select
          className="rounded bg-white px-3 py-2 pr-6 appearance-none focus:outline-none"
          value={pagination.pageSize}
          onChange={(e) => props.onSetPageSize(Number(e.currentTarget.value))}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        {/* Chevron */}
        <span className="pointer-events-none absolute right-2 top-1.5  text-[#02285E]">
          <Icon name="keyboard_arrow_down" className="text-lg!" />
        </span>
      </div>
      <button
        className="rounded border border-[color:var(--colors-grey-4-border,#E9E9E9)] border-solid bg-white px-3 py-1 h-[38px]"
        onClick={() => props.onPrevious()}
        disabled={loading}
      >
        <Icon name="keyboard_arrow_left" className="text-lg!" />
      </button>
      <PageNumbers />
      <button
        className="rounded border border-[color:var(--colors-grey-4-border,#E9E9E9)] border-solid bg-white px-3 py-1 h-[38px]"
        onClick={() => props.onNext()}
        disabled={loading}
      >
        <Icon name="keyboard_arrow_right" className="text-lg!" />
      </button>
    </div>
  );
}
