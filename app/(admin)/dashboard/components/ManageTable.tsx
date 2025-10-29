"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

type Attribute = { key: string; label: string; value: string; order: number };
type Candidate = { id: string; attributes: Attribute[] };

// ********** Local Interface **********
interface SelectHeaderProps {
  allRowsSelected: boolean;
  toggleAllRows: (checked: boolean) => void;
}

// ********** Generate component **********
const SelectHeader: React.FC<SelectHeaderProps> = ({ allRowsSelected, toggleAllRows }) => (
  <Checkbox
    checked={allRowsSelected}
    onCheckedChange={(checked) => toggleAllRows(!!checked)}
    className={cn(
      'h-5 w-5 rounded-[4px] border-2 transition-all duration-150 ease-in-out',
      'data-[state=checked]:bg-[#01959F] data-[state=checked]:border-[#01959F]',
      'data-[state=unchecked]:border-[#01959F] data-[state=unchecked]:bg-transparent',
    )}
  />
);

// ********** Main Component **********
const ManageTable: React.FC<{ data: Candidate[] }> = ({ data }) => {
  // ********** TRANSFORM DATA **********
  const flatData = useMemo(() => {
    return data.map((cand) => {
      const row: Record<string, any> = {};
      cand.attributes.forEach((attr) => (row[attr.key] = attr.value));
      return row;
    });
  }, [data]);

  console.log(data, 'ini data di tabel')

  const containerRef = useRef<HTMLDivElement>(null);

  // ********** COLUMN FROM ATTRUBUTS **********
  const [cols, setCols] = useState<any[]>([]);
  
  useEffect(() => {
    if (!containerRef.current) return;
    if (data.length === 0) return;

    const containerWidth = containerRef.current.clientWidth;

    // sort by order from attributes
    const sorted = [...data[0].attributes].sort((a, b) => a.order - b.order);

    // count the total width
    const fixedColsWidth = 50 + 180; 
    const resizableColsCount = sorted.length - 1;

    const equalWidth = Math.floor(
      (containerWidth - fixedColsWidth) / Math.max(resizableColsCount, 1)
    );

    // generate column
    const generated = [
      {
        accessorKey: "select",
        header: SelectHeader,
        size: 52,
        minSize: 52,
        enableSorting: false,
        enableResizing: false,
        enableReorder: false,
      },
      ...sorted.map((attr) => {
        let baseWidth = equalWidth;
        if (attr.key === "full_name") baseWidth = 180;

        return {
          accessorKey: attr.key,
          header: attr.label.toUpperCase(),
          size: baseWidth,
          minSize: 80,
          enableSorting: true,
          enableResizing: attr.key === "full_name" ? false : true,
          enableReorder: attr.key === "full_name" ? false : true,
          cell:
            attr.key === "linkedin_link"
              ? (value: string) => (
                  <a
                    href={String(value)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#01959F] hover:text-[#037982] underline truncate"
                  >
                    {String(value).split("/").pop()}
                  </a>
                )
              : undefined,
        };
      }),
    ];

    setCols(generated);
  }, [data]);

  const [colSizes, setColSizes] = useState<number[]>([]);
  useEffect(() => {
    setColSizes(cols.map((c) => c.size));
  }, [cols]);

  // ********** STATE **********
  const [sorting, setSorting] = useState<{ key: string; direction: "asc" | "desc" | "" }>({
    key: "",
    direction: "",
  });
  const [isResizing, setIsResizing] = useState(false);
  const resizingColIndex = useRef<number | null>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // ********** RESIZE **********
  const startResize = useCallback((e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (!cols[index].enableResizing) return;
    e.stopPropagation();
    if ('preventDefault' in e) e.preventDefault();
    setIsResizing(true);
    resizingColIndex.current = index;
    startXRef.current = (e as React.MouseEvent).clientX || (e as React.TouchEvent).touches[0].clientX;
    startWidthRef.current = colSizes[index];
  }, [cols, colSizes]);

  const stopResize = useCallback(() => {
    setIsResizing(false);
    resizingColIndex.current = null;
  }, []);

  const handleResizeMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isResizing || resizingColIndex.current === null) return;
      const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      const delta = clientX - startXRef.current;
      const idx = resizingColIndex.current;
      setColSizes((prev) => {
        const newSizes = [...prev];
        const col = cols[idx];
        newSizes[idx] = Math.max(col.minSize, startWidthRef.current + delta);
        return newSizes;
      });
    },
    [isResizing, cols]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', stopResize);
      window.addEventListener('touchmove', handleResizeMove);
      window.addEventListener('touchend', stopResize);
      document.body.style.cursor = 'col-resize';
    } else {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', stopResize);
      window.removeEventListener('touchmove', handleResizeMove);
      window.removeEventListener('touchend', stopResize);
      document.body.style.cursor = 'default';
    }
    return () => {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', stopResize);
      window.removeEventListener('touchmove', handleResizeMove);
      window.removeEventListener('touchend', stopResize);
      document.body.style.cursor = 'default';
    };
  }, [isResizing, handleResizeMove, stopResize]);

  // ********** REORDER **********
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLTableHeaderCellElement>, index: number) => {
    if (isResizing || !cols[index].enableReorder) {
      e.preventDefault();
      return;
    }
    dragItem.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (index: number) => {
    if (dragItem.current === null || !cols[index].enableReorder) return;
    dragOverItem.current = index;
  };

  const handleDrop = () => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    if (from === null || to === null || from === to) return;
    setCols((prev) => {
      const newCols = [...prev];
      const [moved] = newCols.splice(from, 1);
      newCols.splice(to, 0, moved);
      return newCols;
    });
    setColSizes((prev) => {
      const newSizes = [...prev];
      const [moved] = newSizes.splice(from!, 1);
      newSizes.splice(to!, 0, moved);
      return newSizes;
    });
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // ********** SORTING **********
  const handleSortClick = (key: string, enable: boolean) => {
    if (!enable || isResizing) return;
    setSorting((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return { key: "", direction: "" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedData = useMemo(() => {
    if (!sorting.key || !sorting.direction) return flatData;
    return [...flatData].sort((a, b) => {
      const valA = String(a[sorting.key] ?? "").toLowerCase();
      const valB = String(b[sorting.key] ?? "").toLowerCase();
      if (valA < valB) return sorting.direction === "asc" ? -1 : 1;
      if (valA > valB) return sorting.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [flatData, sorting]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  const allRowsSelected =
    paginatedData.length > 0 &&
    paginatedData.every((_, i) => rowSelection[pageIndex * pageSize + i]);

  const toggleAllRows = (checked: boolean) => {
    const newSel = { ...rowSelection };
    paginatedData.forEach((_, i) => {
      const idx = pageIndex * pageSize + i;
      if (checked) newSel[idx] = true;
      else delete newSel[idx];
    });
    setRowSelection(newSel);
  };

  const toggleRow = (idx: number, checked: boolean) => {
    setRowSelection((prev) => {
      const newSel = { ...prev };
      if (checked) newSel[idx] = true;
      else delete newSel[idx];
      return newSel;
    });
  };

  // ********** RENDER **********
  const totalWidth = colSizes.reduce((sum, s) => sum + s, 0);

  return (
    <div className="rounded-[8px] overflow-hidden shadow-md">
      <div ref={containerRef} className="overflow-x-auto rounded-[8px]">
        <table className="table-fixed text-sm border-collapse" style={{ width: totalWidth }}>
          <thead className="bg-[#FCFCFC] text-[0.75rem] font-semibold sticky top-0 z-10">
            <tr className="h-[72px]">
              {cols.map((col, idx) => (
                <th
                  key={col.accessorKey}
                  style={{
                    width: colSizes[idx],
                    minWidth: col.minSize,
                    borderRight: col.accessorKey === 'full_name' ? '1px solid #EDEDED' : '',
                    borderBottom: (col.accessorKey === 'full_name' || col.accessorKey === 'select') ? '1px solid #EDEDED' : '1px solid #f5f4f4',
                  }}
                  className={cn('p-[1rem] relative select-none whitespace-nowrap', col.accessorKey === 'full_name' && 'pl-0')}
                  draggable={col.enableReorder}
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragEnter={() => handleDragEnter(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => handleSortClick(col.accessorKey, col.enableSorting)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      {typeof col.header === 'function' ? (
                        <col.header allRowsSelected={allRowsSelected} toggleAllRows={toggleAllRows} />
                      ) : (
                        col.header
                      )}
                    </div>
                    {sorting.key === col.accessorKey &&
                      (sorting.direction === 'asc' ? (
                        <ArrowUp className="h-3 w-3 text-teal-600 ml-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-teal-600 ml-1" />
                      ))}
                  </div>
                  {col.accessorKey !== 'full_name' && col.accessorKey !== 'select' && (
                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        startResize(e, idx);
                      }}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        startResize(e, idx);
                      }}
                      onClickCapture={(e) => e.stopPropagation()}
                      className="absolute right-0 top-1/2 h-4 -translate-y-1/2 border border-r cursor-col-resize hover:bg-teal-400"
                      style={{ zIndex: 10 }}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedData.map((row, i) => {
              const globalIdx = pageIndex * pageSize + i;
              const isSelected = !!rowSelection[globalIdx];
              return (
                <tr key={globalIdx} className={cn('h-[56px]', isSelected ? 'bg-teal-50' : '')}>
                  {cols.map((col, cidx) => (
                    <td
                      key={col.accessorKey}
                      style={{ width: colSizes[cidx] }}
                      className={cn('p-[1rem] whitespace-nowrap', col.accessorKey === 'full_name' && 'border-r pl-0')}
                    >
                      {col.accessorKey === 'select' ? (
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => toggleRow(globalIdx, !!checked)}
                          className={cn(
                            'h-5 w-5 rounded-[4px] border-2 transition-colors',
                            'data-[state=checked]:bg-[#01959F] data-[state=checked]:border-[#01959F]',
                            'data-[state=checked]:text-white',
                            'data-[state=unchecked]:border-[#01959F] data-[state=unchecked]:bg-transparent',
                          )}
                        />
                      ) : col.cell ? (
                        col.cell(row[col.accessorKey], row)
                      ) : (
                        row[col.accessorKey]
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-end items-center p-2 text-sm text-gray-600 gap-2">
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            disabled={pageIndex === 0}
            onClick={() => setPageIndex((p) => Math.max(p - 1, 0))}
          >
            Prev
          </button>
          <span>
            {pageIndex + 1} / {totalPages}
          </span>
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            disabled={pageIndex + 1 === totalPages}
            onClick={() => setPageIndex((p) => Math.min(p + 1, totalPages - 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageTable;
