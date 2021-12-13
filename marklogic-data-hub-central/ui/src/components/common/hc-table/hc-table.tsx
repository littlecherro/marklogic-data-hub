import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, {customFilter, FILTER_TYPES, Comparator} from "react-bootstrap-table2-filter";
import {DropdownButton, Dropdown} from "react-bootstrap";
import styles from "./hc-table.module.scss";
import "./hc-table.scss";
import {CaretDownFill, CaretUpFill, ChevronDown, ChevronRight} from "react-bootstrap-icons";

interface Props {
  childrenIndent?: boolean;
  className?: string;
  columns: any;
  data: any;
  expandedRowKeys?: number[] | string[];
  key?: string;
  nestedParams?: any;
  showExpandIndicator?: boolean | {bordered?: boolean};
  showHeader?: boolean;
  pagination?: boolean | any;
  rowClassName?: string | ((record: any) => string);
  rowKey?: string | ((record: any) => string);
  subTableHeader?: boolean;
  expandedRowRender?: (record: any, rowIndex?: number) => string | React.ReactNode;
  onExpand?: (record: any, expanded: boolean, rowIndex?: number) => void;
  onTableChange?: (type: string, newState: any) => void;
}

function HCTable({className, childrenIndent, data, expandedRowKeys, nestedParams, pagination, rowClassName, rowKey, showExpandIndicator = false, onExpand, expandedRowRender, ...props}: Props): JSX.Element {
  const expandConfig = {
    className: `${styles.expandedRowWrapper} ${props.subTableHeader ? styles.subTableNested : ""} ${childrenIndent ? styles.childrenIndentExpanded : ""}`,
    expanded: expandedRowKeys,
    showExpandColumn: !!showExpandIndicator, // Check
    onExpand,
    renderer: expandedRowRender,
    expandColumnRenderer: ({expanded, rowKey, expandable}) => {
      let bordered;

      if (!expandable) {
        return null;
      }

      if (typeof showExpandIndicator === "object") {
        bordered = showExpandIndicator.bordered;
      }

      return expanded ? <ChevronDown data-testid={`${rowKey}-expand-icon`} className={bordered ? styles.borderedIndicator : ""} aria-label="down"/> :
        <ChevronRight data-testid={`${rowKey}-expand-icon`} className={bordered ? styles.borderedIndicator : ""} aria-label="right"/>;
    },
    expandHeaderColumnRenderer: () => "",
    nonExpandable: !props.subTableHeader && !childrenIndent ? [] : data.map(row => typeof rowKey === "string" && row[rowKey] && !row.children && row[rowKey]).filter(row => !!row),
  };

  if (childrenIndent && !expandedRowRender) {
    expandConfig.renderer = row => renderNested({row, ...nestedParams});
  }

  const defaultSorted: Array<{dataField: string; order: string;}> = []; // expects { dataField: string; order: string; }
  const noDataIndication = () => <div className={styles.noDataPlaceholder}><span>No Data</span></div>;
  let paginationFactoryObject = null;
  let filterFactoryObject = null;

  if (pagination) {
    const options: any = {
      alwaysShowAllBtns: true,
      withFirstAndLast: true,
    };

    if (pagination.hideOnSinglePage) { // ToDo: fix
      options.hidePageListOnlyOnePage = pagination.hideOnSinglePage;
    }

    if (pagination.showSizeChanger) {
      if (pagination.pageSizeOptions) {
        options.sizePerPageList = pagination.pageSizeOptions.map(pageSize => {
          return {
            text: `${pageSize} / page`,
            value: +pageSize,
          };
        });
      }

      if (pagination.onShowSizeChange) {
        options.onSizePerPageChange = pagination.onShowSizeChange;
      }

      options.sizePerPageRenderer = ({options, currSizePerPage, onSizePerPageChange}) => (
        <div className="test">
          <DropdownButton
            variant="outline-light"
            aria-label="size-per-page"
            id="size-per-page"
            align="end"
            className="sizePageSelector"
            title={`${currSizePerPage} / page`}
            onSelect={onSizePerPageChange}>
            {options.map(option => {
              return <Dropdown.Item key={`${option.page}`} eventKey={`${option.page}`} className={`${+option.page === +currSizePerPage ? "item-active" : ""}`}>
                <span aria-label={`${option.text}`}>{option.text}</span>
              </Dropdown.Item>;
            })}
          </DropdownButton>
        </div>
      );
    } else {
      options.hideSizePerPage = true;
    }

    if (pagination.onChange) {
      options.onPageChange = pagination.onChange;
    }

    if (pagination.pageSize) {
      options.sizePerPage = pagination.pageSize;
    }

    if (pagination.current) {
      options.page = pagination.current;
    }

    if (pagination.defaultCurrent) {
      options.pageStartIndex = pagination.defaultCurrent;
    }

    paginationFactoryObject = paginationFactory(options);
  }

  props.columns.forEach(column => {
    if (!column.key) {
      column.key = column.dataField;
    }

    column.classes = styles.tableCell;

    if (column.className) {
      column.classes += ` ${column.className}`;
    }

    column.headerClasses = styles.header;

    if (props.subTableHeader) {
      column.headerClasses += ` ${styles.subTableHeader}`;
    }

    if (childrenIndent) {
      column.headerClasses += ` ${styles.childrenIndentHeader}`;
    }

    if (expandedRowRender) {
      column.headerClasses += ` ${styles.hasExpandedRow}`;
    }

    if (column.defaultSortOrder) {
      defaultSorted.push({
        dataField: column.dataField,
        order: column.defaultSortOrder,
      });
    }

    column.sortCaret = (order, _) => {
      let carets = (<><CaretUpFill className={styles.caret} aria-label="icon: caret-up"/><CaretDownFill className={styles.caret} aria-label="icon: caret-down"/></>);

      if (order === "asc") {
        carets = (<><CaretUpFill className={styles.activeCaret} aria-label="icon: caret-up" /><CaretDownFill className={styles.caret} aria-abel="icon: caret-down"/></>);
      } else if (order === "desc") {
        carets = (<><CaretUpFill className={styles.caret} aria-label="icon: caret-up" /><CaretDownFill className={styles.activeCaret} aria-label="icon: caret-down"/></>);
      }
      return <div className={styles.caretContainer}>{carets}</div>;
    };

    if (column.sort) {
      if (column.onSort) {
        const sortDelegate = column.onSort;
        column.onSort = (field, order) => {
          sortDelegate(field, order);
          if (props.onTableChange) {
            props.onTableChange("order", {columnKey: field, order});
          }
        };
      } else {
        column.onSort = (field, order) => {
          if (props.onTableChange) {
            props.onTableChange("order", {columnKey: field, order});
          }
        };
      }
    }

    if (column.customFilter) {
      const options = {
        type: FILTER_TYPES.TEXT,
        comparator: Comparator.EQ,
      };

      column.filter = customFilter(options);
      filterFactoryObject = filterFactory();
      // Check DHFPROD-8040 for implementation pointers for column.filterRenderer
    }

    if (column.width) {
      column.style={width: `${column.width}px`};
    }
  });

  let rowClasses = `hc-table_row ${rowClassName || ""}`;

  if (props.onTableChange) {
    delete props.onTableChange;
  }

  return (
    <BootstrapTable
      key={props.key}
      keyField={rowKey}
      bordered={false}
      data={data}
      defaultSortDirection="asc"
      defaultSorted={defaultSorted}
      expandRow={expandConfig}
      filter={filterFactoryObject}
      noDataIndication={noDataIndication}
      pagination={paginationFactoryObject}
      rowClasses={rowClassName || rowClasses}
      wrapperClasses={props.subTableHeader ? `${className || ""} sub-table` : className || ""}
      {...props}
    />
  );
}

const renderRow = ({row, headerColumns, iconCellList, state, showIndicator, isExpanded}) => {
  const [expandedNestedRows] = state;

  return <div key={row.rowKey || row.key} className={`${styles.childrenIndentTableRow} hc-table_row`} data-row-key={row.key}>
    {showIndicator ? <div key={`indicator_${row.key}`} className={styles.childrenIndentIndicatorCell}>
      {row.children ? <div onClick={() => { isExpanded(row.key); } }>{expandedNestedRows.includes(row.key) ? <ChevronDown data-testid={`${row.key}-expand-icon`} /> : <ChevronRight data-testid={`${row.key}-expand-icon`} />}</div>: null}
    </div>: <div className={styles.childrenIndentIndicatorCell}>&nbsp;</div>}
    {headerColumns.map((col) => {
      const hasIconCell = iconCellList.lastIndexOf(col.dataField) !== -1;
      const childElement = col.formatter ? col.formatter(row[col.dataField], row) : row[col.dataField];

      return <div key={col.dataField} className={styles.childrenIndentElementCell} style={{padding: hasIconCell ? "12px" : "16px", width: col.width || "auto"}}>{childElement}</div>;
    })}</div>;
};

const renderNested = ({row, headerColumns, iconCellList, state}) => {
  const [expandedNestedRows, setExpandedNestedRows] = state;
  const isExpanded = (key) => {
    const index = expandedNestedRows.indexOf(key);

    if (index === -1) {
      const addedKeys = [...expandedNestedRows, key];
      setExpandedNestedRows(addedKeys);
    } else {
      const removedKeys = [...expandedNestedRows];
      removedKeys.splice(index, 1);
      setExpandedNestedRows(removedKeys);
    }
  };

  let result: any = [];

  if (row.children) {
    let childrenList: any = [...row.children];

    while (childrenList.length > 0) {
      let currentRow = childrenList.shift();
      let tableRow = renderRow({row: currentRow, headerColumns, iconCellList, state, showIndicator: currentRow.children, isExpanded});
      result.push(tableRow);
      const children = currentRow.children;

      if (children && expandedNestedRows.includes(currentRow.key)) {
        childrenList = [...children, ...childrenList];
      }
    }
  }

  return <div className={styles.childrenIndentTableExpanded}>{result}</div>;

};

export default HCTable;