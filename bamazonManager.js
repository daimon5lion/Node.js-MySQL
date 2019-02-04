var mysql = require("mysql");
var inquirer = require("inquirer");

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
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "End Session"
        ]
      }
    ])
    .then(function(ans) {
      switch (ans.doThing) {
        case "View Products for Sale":
          viewProducts();
          break;
        case "View Low Inventory":
          viewLowInventory();
          break;
        case "Add to Inventory":
          addToInventory();
          break;
        case "Add New Product":
          addNewProduct();
          break;
        case "End Session":
          console.log("See you next time!");
      }
    });
}

function viewProducts() {
  console.log(">>>>>>Viewing Products<<<<<<");

  connection.query("SELECT * FROM Products", function(err, res) {
    if (err) throw err;
    console.log(
      "----------------------------------------------------------------------------------------------------"
    );

    for (var i = 0; i < res.length; i++) {
      console.log(
        "ID: " +
          res[i].item_id +
          " | " +
          "Product: " +
          res[i].product_name +
          " | " +
          "Department: " +
          res[i].department_name +
          " | " +
          "Price: " +
          res[i].price +
          " | " +
          "QTY: " +
          res[i].stock_quantity
      );
      console.log(
        "--------------------------------------------------------------------------------------------------"
      );
    }

    start();
  });
}

function viewLowInventory() {
  console.log(">>>>>>Viewing Low Inventory<<<<<<");

  connection.query("SELECT * FROM Products", function(err, res) {
    if (err) throw err;
    console.log(
      "----------------------------------------------------------------------------------------------------"
    );

    for (var i = 0; i < res.length; i++) {
      if (res[i].stock_quantity <= 10) {
        console.log(
          "ID: " +
            res[i].item_id +
            " | " +
            "Product: " +
            res[i].product_name +
            " | " +
            "Department: " +
            res[i].department_name +
            " | " +
            "Price: " +
            res[i].price +
            " | " +
            "QTY: " +
            res[i].stock_quantity
        );
        console.log(
          "--------------------------------------------------------------------------------------------------"
        );
      }
    }

    start();
  });
}

function addToInventory() {
  console.log(">>>>>>Adding to Inventory<<<<<<");

  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    var itemArray = [];

    for (var i = 0; i < res.length; i++) {
      itemArray.push(res[i].product_name);
    }

    inquirer
      .prompt([
        {
          type: "list",
          name: "product",
          choices: itemArray,
          message: "Which item would you like to add inventory?"
        },
        {
          type: "input",
          name: "qty",
          message: "How much would you like to add?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            } else {
              return false;
            }
          }
        }
      ])
      .then(function(answer) {
        var currentQty;
        for (var i = 0; i < res.length; i++) {
          if (res[i].product_name === answer.product) {
            currentQty = res[i].stock_quantity;
          }
        }
        connection.query(
          "UPDATE Products SET ? WHERE ?",
          [
            { stock_quantity: currentQty + parseInt(answer.qty) },
            { product_name: answer.product }
          ],
          function(err, res) {
            if (err) throw err;
            console.log("The quantity was updated.");
            start();
          }
        );
      });
  });
}

function addNewProduct() {
  console.log(">>>>>>Adding New Product<<<<<<");

  var deptNames = [];

  connection.query("SELECT * FROM departments", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      deptNames.push(res[i].department_name);
    }

    inquirer
      .prompt([
        {
          type: "input",
          name: "product",
          message: "Product: ",
          validate: function(value) {
            if (value) {
              return true;
            } else {
              return false;
            }
          }
        },
        {
          type: "list",
          name: "department",
          message: "Department: ",
          choices: deptNames
        },
        {
          type: "input",
          name: "price",
          message: "Price: ",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            } else {
              return false;
            }
          }
        },
        {
          type: "input",
          name: "quantity",
          message: "Quantity: ",
          validate: function(value) {
            if (isNaN(value) == false) {
              return true;
            } else {
              return false;
            }
          }
        }
      ])
      .then(function(answer) {
        connection.query(
          "INSERT INTO products SET ?",
          {
            product_name: answer.product,
            department_name: answer.department,
            price: answer.price,
            stock_quantity: answer.quantity
          },
          function(err, res) {
            if (err) throw err;
            console.log("Another item was added to the store.");
            start();
          }
        );
      });
  });
}
