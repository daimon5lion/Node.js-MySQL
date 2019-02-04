var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "62391208",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  start();
});

function start() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "doThing",
        message: "What would you like to do?",
        choices: [
          "View Product Sales by Department",
          "Create New Department",
          "End Session"
        ]
      }
    ])
    .then(function(ans) {
      switch (ans.doThing) {
        case "View Product Sales by Department":
          viewProductByDept();
          break;
        case "Create New Department":
          createNewDept();
          break;
        case "End Session":
          console.log("Bye!");
      }
    });
}

function viewProductByDept() {
  connection.query("SELECT * FROM departments", function(err, res) {
    if (err) throw err;

    console.log(">>>>>>Product Sales by Department<<<<<<");
    console.log(
      "----------------------------------------------------------------------------------------------------"
    );

    var deptTable = new Table({
      head: [
        "department_id",
        "department_name",
        "over_head_costs",
        "product_sales",
        "total_profit"
      ],
      colWidths: [15, 25, 18, 15, 15]
    });

    for (var i = 0; i < res.length; i++) {
      var deptProfit = (res[i].product_sales - res[i].over_head_costs).toFixed(
        2
      );
      deptTable.push([
        res[i].department_id,
        res[i].department_name,
        res[i].over_head_costs.toFixed(2),
        res[i].product_sales.toFixed(2),
        deptProfit
      ]);
    }
    console.log(deptTable.toString());

    console.log(
      "--------------------------------------------------------------------------------------------------"
    );

    start();
  });
}

function createNewDept() {
  console.log(">>>>>>Creating New Department<<<<<<");

  inquirer
    .prompt([
      {
        type: "input",
        name: "deptName",
        message: "Department Name: "
      },
      {
        type: "input",
        name: "overHeadCost",
        message: "Over Head Cost: ",
        default: 0,
        validate: function(val) {
          if (isNaN(val) === false) {
            return true;
          } else {
            return false;
          }
        }
      },
      {
        type: "input",
        name: "prodSales",
        message: "Product Sales: ",
        default: 0,
        validate: function(val) {
          if (isNaN(val) === false) {
            return true;
          } else {
            return false;
          }
        }
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO departments SET ?",
        {
          department_name: answer.deptName,
          over_head_costs: answer.overHeadCost,
          product_sales: answer.prodSales
        },
        function(err, res) {
          if (err) throw err;
          console.log("Another department was added.");
        }
      );
      start();
    });
}
