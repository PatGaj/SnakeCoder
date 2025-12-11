'use client'

import React, { useMemo } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { Button } from '@/components/button'
import { cn } from '@/lib/utils'

const tableStyles = tv({
  slots: {
    wrapper: 'overflow-hidden rounded-lg border border-primary-800/80 shadow-[0_18px_42px_#00000084]',
    table: 'min-w-full divide-y divide-primary-800/70 bg-primary-950/80 text-sm text-snowWhite-50',
    head: 'bg-primary-900/60',
    headerCell: 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-snowWhite-300',
    row: 'border-b border-primary-900/70 transition-colors hover:bg-primary-900/50',
    cell: 'px-4 py-3 text-snowWhite-100',
    empty: 'px-4 py-6 text-center text-snowWhite-300',
  },
  variants: {
    dense: {
      true: { headerCell: 'px-3 py-2', cell: 'px-3 py-2' },
    },
    zebra: {
      true: { row: 'odd:bg-primary-950/60 even:bg-primary-900/40' },
    },
  },
  defaultVariants: {
    dense: false,
    zebra: false,
  },
})

type Column<T> = {
  key: keyof T | '__actions'
  label: React.ReactNode
  render?: (value: T[keyof T], row: T) => React.ReactNode
  align?: 'left' | 'right' | 'center'
}

type RowAction<T> = {
  label: React.ReactNode
  onClick: (row: T) => void
  disabled?: boolean
  variant?: 'primary' | 'ghost' | 'muted' | 'danger'
  className?: string
}

type TableProps<T extends Record<string, any>> = VariantProps<typeof tableStyles> & {
  columns: Column<T>[]
  data: T[]
  emptyLabel?: React.ReactNode
  className?: string
  actions?: RowAction<T>[]
  actionsLabel?: React.ReactNode
  actionsAlign?: 'left' | 'right' | 'center'
}

function Table<T extends Record<string, any>>({
  columns,
  data,
  emptyLabel = 'Brak danych',
  dense,
  zebra,
  className,
  actions,
  actionsLabel = 'Akcje',
  actionsAlign = 'center',
}: TableProps<T>) {
  const styles = tableStyles({ dense, zebra })

  const computedColumns: Column<T>[] = useMemo(() => {
    if (!actions || actions.length === 0) return columns

    const actionsColumn: Column<T> = {
      key: '__actions',
      label: actionsLabel,
      align: actionsAlign,
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          {actions.map((action, idx) => {
            const variant = action.variant ?? 'ghost'
            type ButtonVariant = 'primary' | 'glow' | 'outline' | 'muted' | 'gradient' | 'ghost'
            const buttonVariant: ButtonVariant = variant === 'danger' ? 'muted' : variant
            const dangerClasses =
              variant === 'danger'
                ? 'border-chiliRed-600 bg-chiliRed-600 text-snowWhite-50 hover:bg-chiliRed-500'
                : undefined
            return (
              <Button
                key={`${String(action.label)}-${idx}`}
                variant={buttonVariant}
                size="sm"
                className={cn('text-xs px-3 py-1', dangerClasses, action.className)}
                onClick={() => action.onClick(row)}
                disabled={action.disabled}
              >
                {action.label}
              </Button>
            )
          })}
        </div>
      ),
    }

    return [...columns, actionsColumn]
  }, [actions, actionsAlign, actionsLabel, columns])

  return (
    <div className={cn(styles.wrapper(), className)}>
      <table className={styles.table()}>
        <thead className={styles.head()}>
          <tr>
            {computedColumns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  styles.headerCell(),
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center'
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td className={styles.empty()} colSpan={computedColumns.length}>
                {emptyLabel}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={rowIdx} className={styles.row()}>
                {computedColumns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={cn(
                      styles.cell(),
                      col.align === 'right' && 'text-right',
                      col.align === 'center' && 'text-center'
                    )}
                  >
                    {col.render ? col.render(row[col.key], row) : (row[col.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

Table.displayName = 'Table'

export default Table

export type { TableProps, RowAction as TableRowAction, Column as TableColumn }
