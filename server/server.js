require("dotenv").config({ path: ".env" });
const express = require("express");
const mongoose = require("mongoose");
const Billing = require("./models/BillingModel");
const Expenses = require("./models/ExpensesModel");
const Admin = require("./models/AdminModel.js");
const ProductSoldModel = require("./models/ProductSoldModel");
const Inventory = require("./models/InventoryModel.js");
const app = express();
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const moment = require("moment");

// Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
const apiRouters = express.Router();
app.use("/api", apiRouters);

// System Authentication
function authToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
}

// Start Authentication Routers
apiRouters.get("/protected", authToken, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.log(err);
  }
});
// End Authentication Routers

// Start Login System Routers

apiRouters.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if ((email, password)) {
      if (email.length === 24) {
        const checkUsername = await Admin.findOne({ _id: email });
        if (checkUsername) {
          const checkPassword = await bcrypt.compare(
            password,
            checkUsername.password
          );
          if (checkPassword) {
            const { _id, email } = checkUsername;
            const token = jwt.sign({ _id, email }, process.env.JWT_SECRET_KEY, {
              expiresIn: 60 * 60,
            });
            return res.json({ token });
          } else {
            return res.status(404).json({
              status: 404,
              message: "Email & Password does not exist.",
            });
          }
        } else {
          return res.status(404).json({
            status: 404,
            message: "Email not found.",
          });
        }
      } else {
        const checkUsername = await Admin.findOne({ email });
        if (checkUsername) {
          const checkPassword = await bcrypt.compare(
            password,
            checkUsername.password
          );
          if (checkPassword) {
            const { _id, email, name } = checkUsername;
            const token = jwt.sign(
              { _id, email, name },
              process.env.JWT_SECRET_KEY,
              { expiresIn: 60 * 60 }
            );
            return res.json({ token });
          } else {
            return res.status(404).json({
              status: 404,
              message: "Email & Password does not exist.",
            });
          }
        } else {
          return res.status(404).json({
            status: 404,
            message: "Email not found.",
          });
        }
      }
    } else {
      return res.status(204).json({
        code: 204,
        message: "Username & Password are required.",
      });
    }
  } catch (err) {
    console.log(err.message);
  }
});

apiRouters.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const addData = new Admin({ email, password, name });
    const saveAdmin = await addData.save();
    res.json({
      status: 200,
      message: "Admin User Registered Successfully.",
    });
  } catch (err) {
    if (err.code === 11000) {
      res.json({
        status: 11000,
        message: "Email & Password has been taken.",
      });
    }
  }
});

apiRouters.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;
    const transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const forgotToken = jwt.sign({ email }, process.env.JWT_SECRET_FORGOT, {
      expiresIn: "10m",
    });

    const option = {
      from: "JMI <gabrielryans.fifibuy@gmail.com>",
      to: email,
      subject: "Password Reset Request | JMI",
      html: `<div>
              Dear ${email},
              <br>
              <br>
              <br>

              We have received a request to reset the password for your account.To set a new password, please click on the following link:
              <br>
              <br>
              <a href='http://${
                process.env.CLIENT_DOMAIN + "/new-password?token=" + forgotToken
              }'>Reset Password Link</a>
              <br>
              <br>

              If you did not request a password reset, please ignore this email. Your account is still secure and no changes have been made.
              <br>
              <br>

              For security reasons, the password reset link will expire in 10 minutes. If you do not use the link within this time, you will need to request another password reset.
              <br>
              <br>

              If you have any questions or concerns, please contact our support team at [Support Email Address].
              <br>
              <br>

              Best regards,
              <br>
              <br>

              JMI
            </div >
      `,
      headers: {
        priority: "high",
        importance: "high",
      },
    };
    const transEmail = await transporter.sendMail(option);

    res.json({ code: 200, message: "Reset link has been sent." });
  } catch (err) {
    console.log(err);
  }
});

apiRouters.put("/new-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = await req.body;
    if (password === confirmPassword && password && confirmPassword && token) {
      const user = jwt.verify(token, process.env.JWT_SECRET_FORGOT);
      const encryptPass = bcrypt.hashSync(password, 12);
      const updatePassword = await Admin.updateOne(
        { email: user.email },
        { password: encryptPass }
      );
      return res.json({ code: 200, message: "Password Successfully Updated!" });
    }
    return res.json({
      code: 500,
      message: "Password are not properly setup, please try again.",
    });
  } catch (err) {
    return res.status(403).json({
      code: 403,
      message: "Token has been expired, please request another.",
    });
  }
});
// End Login System Routers

// Start Home
apiRouters.get("/homeData", authToken, async (req, res) => {
  try {
    const inventoryCount = await Inventory.find({}).count();
    const billingCount = await Billing.find({}).count();

    const billResponse = await Billing.aggregate([
      {
        $lookup: {
          from: "inventory",
          localField: "productCode",
          foreignField: "code",
          as: "productInfo",
        },
      },
    ]);
    const billSales = billResponse.reduce(
      (acc, val) =>
        acc + val.productInfo.reduce((sum, product) => sum + product.amount, 0),
      0
    );

    const expensesLoss = await Expenses.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    res.json({
      inventoryTotalItem: inventoryCount - billingCount,
      totalExpenses: expensesLoss[0].totalAmount,
      totalSales: billSales,
    });
  } catch (err) {
    console.log(err);
  }
});

// End Home

// Start Bill Routers

//put a bought product under specific bill
apiRouters.post("/bill/bought-product", async (req, res) => {
  try {
    const {
      user_bought,
      product_name,
      quantity_items_bought,
      mode_of_payment,
      product_id,
      price_of_product,
      account_type,
      discount,
    } = req.body;

    // Check if all required fields are present
    if (
      !user_bought ||
      !product_name ||
      !quantity_items_bought ||
      !mode_of_payment ||
      !product_id ||
      !price_of_product ||
      !account_type
    ) {
      return res.status(400).json({
        status: 400,
        message: "Missing required fields",
      });
    }

    // Find the product in the inventory model
    const product = await Inventory.findById(product_id);
    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product not found in inventory",
      });
    }

    let productQuantity = parseInt(product.quantity);
    let productQuantityBought = parseInt(quantity_items_bought);

    // Check if there is enough quantity in stock to fulfill the order
    if (productQuantity < productQuantityBought) {
      return res.status(400).json({
        status: 400,
        message: "Insufficient quantity in stock",
      });
    }

    // Subtract the quantity bought from the current quantity in stock
    productQuantity -= productQuantityBought;

    await Inventory.findByIdAndUpdate(
      product_id,
      { quantity: productQuantity },
      { new: true }
    );

    // Create a new bill for the purchase
    const newBoughtProduct = await new ProductSoldModel({
      user_bought,
      product_name,
      quantity_items_bought,
      mode_of_payment,
      product_id,
      price_of_product,
      account_type,
      discount,
      createdAt: moment(),
    });

    // Save the new bill to the database
    await newBoughtProduct.save();

    return res.status(200).json({
      status: 200,
      message: "Successfully added product",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
});

apiRouters.get("/bill/bought-product/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all bought products by user id
    const boughtProducts = await ProductSoldModel.find({ user_bought: userId });

    return res.status(200).json({
      status: 200,
      message: "Successfully retrieved bought products",
      data: boughtProducts,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
});

apiRouters.post("/addBill", async (req, res) => {
  try {
    const { name, due_date, payment_date, total_payment } = req.body;
    if (!name || !due_date || !payment_date || !total_payment) {
      return res.status(500).json({
        status: 500,
        message: "Missing fields are required!",
      });
    }
    let vat = parseInt(amount) * 0.12;
    const newBilling = await new Billing({
      name,
      due_date,
      payment_date,
      total_payment: parseInt(total_payment) + vat,

      archive: true,
    });

    newBilling.save();

    return res.status(200).json({
      status: 200,
      message: "Successfully added product",
    });
  } catch (err) {
    console.log(err);
  }
});

//change archive to active
apiRouters.patch("/bill-archive/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const billResponse = await Billing.findById(id);

    if (!billResponse) {
      return res.status(404).json({
        code: 404,
        message: "Billing not found.",
      });
    }

    // Toggle the value of the 'archive' field
    const updatedBill = await Billing.findByIdAndUpdate(
      id,
      { $set: { archive: billResponse.archive ? false : true } },
      { new: true } // Return the updated document
    );

    res.json(updatedBill);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: "Server error.",
    });
  }
});

//get all list of archive billing

apiRouters.get("/bill/archive-list", async (req, res) => {
  try {
    const billResponse = await Billing.find({
      $or: [{ archive: false }, { archive: { $exists: false } }],
    });

    res.status(200).json(billResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: "Server error.",
    });
  }
});

apiRouters.get("/bill/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const billResponse = await Billing.findById(id);
    if (!billResponse) {
      return res.status(404).json({
        code: 404,
        message: "Billing not found.",
      });
    }
    return res.json({
      code: 200,
      data: billResponse,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

apiRouters.get("/bill", async (req, res) => {
  try {
    const { dTo, dFrom } = req.query;
    const matchQuery = {};
    if (dTo && dFrom) {
      matchQuery.createdAt = {
        $gte: new Date(dFrom),
        $lte: new Date(dTo),
      };
    }
    const billResponse = await Billing.aggregate([
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: "inventory",
          localField: "productCode",
          foreignField: "code",
          as: "productInfo",
        },
      },
    ]);
    return res.json({
      statistics: {
        amount: billResponse.reduce(
          (acc, val) =>
            acc +
            val.productInfo.reduce((sum, product) => sum + product.amount, 0),
          0
        ),
        total: billResponse.length,
        rangeDate: {
          from: dFrom,
          to: dTo,
        },
      },
      data: billResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

apiRouters.patch("/bill-edit/:id", async (req, res) => {
  try {
    const { name, due_date, payment_date, total_payment } = req.body;
    const { id } = req.params;
    const updateBill = await Billing.updateOne(
      { _id: id },
      { name, due_date, payment_date, total_payment }
    );
    res.json(updateBill);
  } catch (err) {
    console.log(err);
  }
});

//get All expense and billing

apiRouters.get("/get-expense-billing", async (req, res) => {
  try {
    let expenses = await Expenses.find();
    let billing = await Billing.find();

    // Check if date range is provided
    const { startDate, endDate } = req.query;
    if (startDate && endDate) {
      // Filter expenses and billing by date range
      expenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate)
        );
      });

      billing = billing.filter((bill) => {
        const billDueDate = new Date(bill.due_date);
        return (
          billDueDate >= new Date(startDate) && billDueDate <= new Date(endDate)
        );
      });
    }

    res.status(200).json({ expenses, billing });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

// End Bill Routers

// Start Expenses Routers
apiRouters.post("/expenses", authToken, async (req, res) => {
  // const data = req.body;
  try {
    const { deductionType, description, amount, date } = req.body;
    const { name } = req.user;
    if (deductionType && description && amount && date) {
      const addExpenses = await new Expenses({
        deductionType,
        description,
        amount,
        date,
        account_type: "Expense",
        processBy: name,
      }).save();
      return res.json({
        code: 200,
        message: "Expenses Added Successfully.",
      });
    }
    return res.status(400).json({
      code: 400,
      message: "Expenses Added Successfully.",
    });
  } catch (err) {
    console.log(err);
  }
});

apiRouters.get("/expenses", async (req, res) => {
  try {
    const { dFrom, dTo } = req.query;
    if (dFrom && dTo) {
      const inputTo = new Date(dTo);
      const inputFrom = new Date(dFrom);
      const retrieveExpenses = await Expenses.find({
        date: {
          $gte: inputFrom,
          $lte: inputTo.setDate(inputTo.getDate() + 1),
        },
      });
      return res.json({
        statistics: {
          amount: retrieveExpenses.reduce((acc, val) => acc + val.amount, 0),
          total: retrieveExpenses.length,
          rangeDate: {
            from: dFrom,
            to: dTo,
          },
        },
        data: retrieveExpenses,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

apiRouters.get("/expenses/:id", authToken, async (req, res) => {
  try {
    const { id } = req.params;
    const retrieveExpenses = await Expenses.findOne({ _id: id });
    res.json(retrieveExpenses);
  } catch (err) {
    console.log(err);
  }
});

apiRouters.put("/expenses/:id", authToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { deductionType, description, amount, date } = req.body;
    const updateExpenses = await Expenses.update(
      { _id: id },
      { deductionType, description, amount, date }
    );
    res.json({
      code: 200,
      message: "Updated Successfully.",
    });
  } catch (err) {
    console.log(err);
  }
});

apiRouters.delete("/expenses/:id", authToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteExpenses = await Expenses.deleteOne({ _id: id });
    res.json({
      code: 200,
      message: "Deleted Successfully.",
    });
  } catch (err) {
    console.log(err);
  }
});
// End Expenses Routers

// Start Balance Sheet Routers
apiRouters.get("/sales", async (req, res) => {
  try {
    const data = await Billing.aggregate([
      {
        $lookup: {
          from: "inventory",
          localField: "productCode",
          foreignField: "code",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
          },
          totalSales: {
            $sum: "$product.amount",
          },
        },
      },
      {
        $project: {
          _id: 0,
          sales: "$totalSales",
          month: {
            $let: {
              vars: {
                monthsInYear: [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ],
              },
              in: {
                $arrayElemAt: [
                  "$$monthsInYear",
                  { $subtract: ["$_id.month", 1] },
                ],
              },
            },
          },
          year: "$_id.year",
        },
      },
    ]);

    res.json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.log(err);
  }
});

apiRouters.get("/loss", async (req, res) => {
  const ExpenseLoss = await Expenses.aggregate(
    [
      {
        $group: {
          _id: {
            Month: {
              $month: "$date",
            },
            Year: {
              $year: "$date",
            },
          },
          Loss: {
            $sum: "$amount",
          },
        },
      },
      {
        $project: {
          Loss: "$Loss",
          Month: {
            $arrayElemAt: [
              [
                "",
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              "$_id.Month",
            ],
          },
        },
      },
      {
        $sort: {
          "_id.Month": 1,
          "_id.Year": 1,
        },
      },
    ],
    function (err, result) {
      return result;
    }
  );

  res.json({ success: true, data: ExpenseLoss });
});

apiRouters.get("/netProfit", async (req, res) => {
  const totalSale = await Billing.aggregate([
    {
      $lookup: {
        from: "inventory",
        localField: "productCode",
        foreignField: "code",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $group: {
        _id: {
          Year: { $year: "$date" },
        },
        totalSales: {
          $sum: "$product.amount",
        },
      },
    },
    {
      $project: {
        _id: "$_id",
        Sales: "$totalSales",
        // year: "$_id"
      },
    },
  ]);

  const totalExpense = await Expenses.aggregate(
    [
      {
        $group: {
          _id: {
            Year: {
              $year: "$date",
            },
          },
          Expense: {
            $sum: "$amount",
          },
        },
      },
    ],
    function (err, result) {
      return result;
    }
  );

  const totalProfit = totalSale[0].Sales - totalExpense[0].Expense;

  res.json({
    success: true,
    data: {
      netProfit: totalProfit,
      totalLoss: totalExpense[0].Expense,
      totalSales: totalSale[0].Sales,
      totalSalesYear: totalSale[0]._id.Year,
      totalExpenseYear: totalExpense[0]._id.Year,
    },
  });
});
// End Balance Sheet Routers

// Start Inventory Routers
apiRouters.post("/inventory", authToken, async (req, res) => {
  try {
    const { name, quantity, amount, date } = req.body;
    let vat = parseInt(amount) * 0.12;
    const addInventory = await new Inventory({
      name,
      quantity,
      amount: parseInt(amount) + vat,
      archive: true,
      date,
    }).save();
    res.status(200).json({
      status: 200,
      message: "Product created successfully.",
    });
  } catch (err) {
    console.log(err);
  }
});
//change archive
apiRouters.patch("/inventory/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const inventoryResponse = await Inventory.findById(id);

    if (!inventoryResponse) {
      return res.status(404).json({
        code: 404,
        message: "Inventory not found.",
      });
    }

    // Toggle the value of the 'archive' field
    const updatedInventory = await Inventory.findByIdAndUpdate(
      id,
      { $set: { archive: inventoryResponse.archive ? false : true } },
      { new: true } // Return the updated document
    );

    res.json(updatedInventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: "Server error.",
    });
  }
});

//get all archive inventory

apiRouters.get("/inventory/archive-list", async (req, res) => {
  try {
    const inventoryResponse = await Inventory.find({
      $or: [{ archive: false }, { archive: { $exists: false } }],
    });

    res.status(200).json(inventoryResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: "Server error.",
    });
  }
});

apiRouters.get("/inventory", authToken, async (req, res) => {
  try {
    const { dTo, dFrom } = req.query;
    if (dTo && dFrom) {
      const inputTo = new Date(dTo);
      const inputFrom = new Date(dFrom);
      const productCodes = await Billing.distinct("productCode");
      const retrieveDate = await Inventory.aggregate([
        {
          $match: {
            date: {
              $gte: inputFrom,
              $lte: inputTo,
            },
            code: { $nin: productCodes },
          },
        },
      ]);

      return res.json({
        statistics: {
          amount: retrieveDate.reduce((acc, val) => acc + val.amount, 0),
          total: retrieveDate.length,
          rangeDate: {
            from: dFrom,
            to: dTo,
          },
        },
        data: retrieveDate,
      });
    }

    const productCodes = await Billing.distinct("productCode");
    const retrieveData = await Inventory.find({ code: { $nin: productCodes } });
    return res.json({
      statistics: {
        amount: retrieveData.reduce((acc, val) => acc + val.amount, 0),
        total: retrieveData.length,
      },
      data: retrieveData,
    });
  } catch (err) {
    console.log(err);
  }
});

apiRouters.get("/inventory/:id", authToken, async (req, res) => {
  try {
    const { id } = req.params;
    const getInventory = await Inventory.findOne({ _id: id });
    res.json(getInventory);
  } catch (err) {
    console.log(err);
  }
});

apiRouters.patch("/inventory/:id", authToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, amount, date } = req.body;
    console.log(name, quantity, amount, date);
    const updateData = await Inventory.update(
      {
        _id: id,
      },
      {
        $set: { name, quantity, amount, date },
      }
    );
    res.json(updateData);
  } catch (err) {
    console.log(err);
  }
});

apiRouters.delete("/inventory/:id", authToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteData = await Inventory.deleteOne({ _id: id });
    res.json(deleteData);
  } catch (err) {
    console.log();
  }
});
// End Inventory Routers

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("We are now connected to MONGODB"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`We are now connected on port ${port}`);
});
