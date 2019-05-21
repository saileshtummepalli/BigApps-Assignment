import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {TextField,Table,TableBody,TableCell,TableHead,TablePagination,TableRow,TableSortLabel ,Button} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FilterListIcon from "@material-ui/icons/FilterList";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";
import {Link} from "react-router-dom";
function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Full Name"
  },
  { id: "phone", numeric: true, disablePadding: false, label: "Phone" },
  { id: "username", numeric: true, disablePadding: false, label: "UserName" },
  { id: "companyname", numeric: true, disablePadding: false, label: "CompanyName" },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };
  render() {
    const {
      order,
      orderBy
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                numeric={row.numeric}
                padding={row.disablePadding ? "none" : "default"}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes, toggleFilters } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
          <Typography variant="h6" id="tableTitle">
            Table Management
          </Typography>
      </div>
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton onClick={toggleFilters} aria-label="Filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  handleOnDelete: PropTypes.func.isRequired
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
  }
});

class TableManagement extends React.Component {
  state = {
    order: "asc",
    orderBy: "calories",
    data: [],
    page: 0,
    filters:{},
    rowsPerPage: 5
  };

  componentDidMount() {
    axios.get(`https://jsonplaceholder.typicode.com/users`)
      .then(res => {
        const data = res.data;
        this.setState({ data, orginalData: data });
      })
  } 
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  toggleFiltersFlag = () => {
    const {showFilters} = this.state;
    this.setState({showFilters:!showFilters})
  }

  handleFilterChange = name => event => {
    let { filters, orginalData } = this.state;
    let data = orginalData;
    const currentValue = event.target.value;
    filters[name] = event.target.value;
    if (currentValue !== "") {
      switch (name) {
        case "searchString":
          data = data.filter(
            r =>
              r.name
                .toLowerCase()
                .indexOf(currentValue.toLowerCase()) !== -1 ||
              r.email.toLowerCase().indexOf(currentValue.toLowerCase()) !== -1
          );
          break;
          default:
      }
    }
    this.setState({ filters, data });
  };

  generateFiltersSelection = () => {
    return (
      <div style={{ padding: 5 }}>
            <TextField
              value={this.state.filters.searchString || ""}
              placeholder="Seach"
              variant="outlined"
              onChange={this.handleFilterChange("searchString")}
            />
      </div>
    );
  };
  render() {
    const { classes } = this.props;
    const { data, order, orderBy, rowsPerPage, page , showFilters} = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    return (
      <div>
        <Paper className={classes.root}>
          <EnhancedTableToolbar
            handleOnDelete={this.handleOnDelete}
            toggleFilters={this.toggleFiltersFlag}
          />
          {showFilters === true ? this.generateFiltersSelection() : null}
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={data.length}
              />
              <TableBody>
                {stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(n => {
                   // const isSelected = this.isSelected(n.id);
                    return (
                      <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      tabIndex={-1}
                      key={n.id}
                    >
                      <TableCell component="th" scope="row" padding="none">
                        {n.name}
                      </TableCell>
                      <TableCell align="right">{n.phone}</TableCell>
                      <TableCell align="right">{n.username}</TableCell>
                      <TableCell align="right">{n.company.name}</TableCell>
                    </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              "aria-label": "Previous Page"
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page"
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
               <Button 
                component={Link}
                to="/"
                color="primary"
                style={{ width: "auto" }}>
                    Previous
               </Button>
               <Button 
                component={Link}
                to="/drag"
                color="primary"
                style={{ width: "auto" }}>
                    Next
               </Button>
      </div>
    );
  }
}

TableManagement.propTypes = {
  classes: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isAjaxFetching: PropTypes.bool.isRequired,
  error: PropTypes.any.isRequired,
  requestInflunecersList: PropTypes.func.isRequired
};

export default withStyles(styles)(TableManagement);
