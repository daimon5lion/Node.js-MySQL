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
  startPurchase();
});

function startPurchase() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    console.log('_.~"~._.~"~._.~Welcome to BAMazon~._.~"~._.~"~._');
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

    console.log(" ");
    inquirer
      .prompt([
        {
          type: "input",
          name: "id",
          message: "What is the product ID which you would like to purchase?",
          validate: function(value) {
            if (
              isNaN(value) == false &&
              parseInt(value) <= res.length &&
              parseInt(value) > 0
            ) {
              return true;
            } else {
              return false;
            }
          }
        },
        {
          type: "input",
          name: "qty",
          message: "How much would you like to purchase?",
          validate: function(value) {
            if (isNaN(value)) {
              return false;
            } else {
              return true;
            }
          }
        }
      ])
      .then(function(answer) {
        var whatToBuy = answer.id - 1;
        var howMuchToBuy = parseInt(answer.qty);
        var grandTotal = parseFloat(
          (res[whatToBuy].price * howMuchToBuy).toFixed(2)
        );

        if (res[whatToBuy].stock_quantity >= howMuchToBuy) {
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              { stock_quantity: res[whatToBuy].stock_quantity - howMuchToBuy },
              //{ product_sales: grandTotal },
              { item_id: answer.id }
            ],
            function(err, result) {
              if (err) throw err;
              console.log("Success! Your total is $" + grandTotal.toFixed(2));
              reprompt();
            }
          );

          /////////////////////////////////////////////////////////

          connection.query("SELECT * FROM departments", function(err, deptRes){
            if(err) throw err;
            var index;
            for(var i = 0; i < deptRes.length; i++){
              if(deptRes[i].department_name === res[whatToBuy].department_name){
                index = i;
              }
            }
            
            
            connection.query("UPDATE Departments SET ? WHERE ?", [
            {product_sales: deptRes[index].product_sales + grandTotal},
            {department_name: res[whatToBuy].department_name}
            ], function(err, deptRes){
                if(err) throw err;
                
            });
          });
          ////////////////////////////////////////////////
          

          connection.query(
            "UPDATE products SET ? WHERE ?",
            [{ product_sales: grandTotal }, { item_id: answer.id }],
            function(err, result) {
              if (err) throw err;
            }
          );

          ///////////////////////////////////////////////
        } else {
          console.log("Sorry, there's not enough in stock!");
          reprompt();
        }
      });
  });
}

function reprompt() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "reply",
        message: "Would you like to purchase another item?"
      }
    ])
    .then(function(answer) {
      if (answer.reply) {
        startPurchase();
      } else {
        console.log("See you soon!");
      }
    });
}
