import { Link } from "@tanstack/react-router";
import { SectionCard } from "@commerceos/shared/components/section-card";
import { StatusBadge } from "@commerceos/shared/components/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@commerceos/ui";
import { formatDate } from "@commerceos/shared/lib/utils";
import type { Discount } from "@commerceos/shared/types";

interface DiscountsTableProps {
  discounts: Discount[];
}

function formatDiscountValue(type: string, value: number) {
  if (type === "percentage") return `${value}%`;
  if (type === "fixed_amount") return `$${value}`;
  return "Free shipping";
}

export function DiscountsTable({ discounts }: DiscountsTableProps) {
  return (
    <SectionCard>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Rules</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {discounts.map((discount) => (
            <TableRow key={discount.id}>
              <TableCell>
                <Link to="/discounts/$discountId" params={{ discountId: discount.id }} className="font-medium text-primary hover:underline">
                  {discount.code}
                </Link>
              </TableCell>
              <TableCell>{discount.type.replace("_", " ")}</TableCell>
              <TableCell>{formatDiscountValue(discount.type, discount.value)}</TableCell>
              <TableCell className="table-cell-muted">
                {discount.rules.minimumSpend ? `Min ${discount.rules.minimumSpend}` : "No minimum"}
                {discount.rules.eligibleSegments.length ? ` · ${discount.rules.eligibleSegments.join(", ")}` : ""}
                {discount.rules.eligibleCategories.length ? ` · ${discount.rules.eligibleCategories.join(", ")}` : ""}
              </TableCell>
              <TableCell>
                <StatusBadge status={discount.active ? "active" : "inactive"} />
              </TableCell>
              <TableCell>{discount.usageCount}</TableCell>
              <TableCell>{formatDate(discount.startDate)}</TableCell>
              <TableCell>{formatDate(discount.endDate)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SectionCard>
  );
}
