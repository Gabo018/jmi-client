require("dotenv").config({ path: ".env" });
const express = require("express");
const mongoose = require("mongoose");
const Billing = require("./models/BillingModel");
const Expenses = require("./models/ExpensesModel");
const Admin = require('./models/AdminModel.js');
const Inventory = require('./models/InventoryModel.js');
const app = express();
const cors = require("cors");
const path = require("path");
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');


// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors({
  origin: '*'
}));
const apiRouters = express.Router();
app.use('/api', apiRouters)

// System Authentication
function authToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(401)
    req.user = user;
    next();
  })
}

// Start Authentication Routers
apiRouters.get('/protected', authToken, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.log(err)
  }
})
// End Authentication Routers

// Start Login System Routers

apiRouters.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email, password) {

      if (email.length === 24) {
        const checkUsername = await Admin.findOne({ _id: email })
        if (checkUsername) {
          const checkPassword = await bcrypt.compare(password, checkUsername.password)
          if (checkPassword) {
            const { _id, email } = checkUsername;
            const token = jwt.sign({ _id, email }, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 60 });
            return res.json({ token })
          } else {
            return res.status(404).json({
              status: 404,
              message: 'Email & Password does not exist.'
            })
          }
        } else {
          return res.status(404).json({
            status: 404,
            message: 'Email not found.'
          })
        }
      } else {
        const checkUsername = await Admin.findOne({ email })
        if (checkUsername) {
          const checkPassword = await bcrypt.compare(password, checkUsername.password)
          if (checkPassword) {
            const { _id, email } = checkUsername;
            const token = jwt.sign({ _id, email }, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 60 });
            return res.json({ token })
          } else {
            return res.status(404).json({
              status: 404,
              message: 'Email & Password does not exist.'
            })
          }
        } else {
          return res.status(404).json({
            status: 404,
            message: 'Email not found.'
          })
        }
      }

    } else {
      return res.status(204).json({
        code: 204,
        message: 'Username & Password are required.'
      })
    }
  } catch (err) {
    console.log(err.message)
  }
})

apiRouters.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;
    const transporter = await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD
      }
    });

    const forgotToken = jwt.sign({ email }, process.env.JWT_SECRET_FORGOT, { expiresIn: '10m' });

    const option = {
      from: 'JMI <gabrielryans.fifibuy@gmail.com>',
      to: email,
      subject: 'Password Reset Request | JMI',
      html: `<div>
              Dear ${email},
              <br>
              <br>
              <br>

              We have received a request to reset the password for your account.To set a new password, please click on the following link:
              <br>
              <br>
              <a href='http://${process.env.CLIENT_DOMAIN + '/new-password?token=' + forgotToken}'>Reset Password Link</a>
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
        'priority': 'high',
        'importance': 'high'
      }
    }
    const transEmail = await transporter.sendMail(option)


    res.json({ code: 200, message: 'Reset link has been sent.' })

  } catch (err) {
    console.log(err)
  }
});

apiRouters.put('/new-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = await req.body;
    if (password === confirmPassword && password && confirmPassword && token) {
      const user = jwt.verify(token, process.env.JWT_SECRET_FORGOT);
      const encryptPass = bcrypt.hashSync(password, 12)
      const updatePassword = await Admin.updateOne({ email: user.email }, { password: encryptPass });
      return res.json({ code: 200, message: 'Password Successfully Updated!' });
    }
    return res.json({
      code: 500,
      message: 'Password are not properly setup, please try again.'
    })

  } catch (err) {
    return res.status(403).json({
      code: 403,
      message: 'Token has been expired, please request another.'
    });
  }
})
// End Login System Routers

// Start Bill Routers
apiRouters.post('/addBill', async (req, res) => {
  try {
    const { name, date, contact, productCode } = req.body;
    if (name && date && contact && productCode) {
      const findPCode = await Inventory.find({ code: productCode }).count()
      if (findPCode === 0) {
        return res.json({
          code: 404,
          message: 'Product Code not found.'
        })
      }
      const inputData = await new Billing({ name, date, contact, productCode }).save()
      return res.json(inputData)
    }
    return res.status(500).json({
      status: 500,
      message: 'name, date, contact and product code are required.'
    })


  } catch (err) {
    console.log(err)
  }
})

apiRouters.get('/bill/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const billResponse = await Inventory.find({ code })
    if (billResponse.length === 0) {
      return res.status(404).json({
        code: 404,
        message: 'Product Code not found.'
      })
    }
    return res.json({
      code: 200,
      data: billResponse
    })
  } catch (err) {
    console.log(err)
  }
})

apiRouters.get('/bill', async (req, res) => {
  try {
    const { dTo, dFrom } = req.query;
    if (dTo && dFrom) {
      const inputTo = new Date(dTo);
      const inputFrom = new Date(dFrom);
      const billResponse = await Billing.aggregate([
        {
          $match: {
            date: {
              $gte: inputFrom,
              $lte: inputTo
            }
          },
        },
        {
          $lookup: {
            from: 'inventory',
            localField: 'productCode',
            foreignField: 'code',
            as: 'productInfo'
          }
        }])
      return res.json({
        statistics: {
          amount: billResponse.reduce((acc, val) => acc + val.productInfo.reduce((sum, product) => sum + product.amount, 0), 0),
          total: billResponse.length,
          rangeDate: {
            from: dFrom,
            to: dTo
          }
        },
        data: billResponse
      })
    }
    const billResponse = await Billing.aggregate([
      {
        $lookup: {
          from: 'inventory',
          localField: 'productCode',
          foreignField: 'code',
          as: 'productInfo'
        }
      }])
    return res.json({
      statistics: {
        amount: billResponse.reduce((acc, val) => acc + val.productInfo.reduce((sum, product) => sum + product.amount, 0), 0),
        total: billResponse.length,
      },
      data: billResponse
    })

  } catch (err) {
    console.log(err)
  }
})

apiRouters.get('/viewBill/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id.length)
    if (id.length === 24) {
      const viewBillId = await Billing.find({ _id: id })
      if (viewBillId.length === 0) {
        return res.json({
          code: 404,
          message: 'ID not found.'
        })
      }
      return res.json(viewBillId[0])
    }
    return res.json({
      code: 404,
      message: 'ID not found.'
    });


  } catch (err) {
    console.log(err)
  }
})

apiRouters.put('/viewBill/:id', async (req, res) => {
  try {
    const { name, date, contact } = req.body;
    const { id } = req.params;
    const updateBIlling = await Billing.update({ _id: id }, { name, date, contact })
    res.json(updateBIlling)
  } catch (err) {
    console.log(err)
  }
})

apiRouters.delete('/bill/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteBill = await Billing.deleteOne({ _id: id })
    res.json(deleteBill)
  } catch (err) {
    console.log(err)
  }
})
// End Bill Routers

// Start Expenses Routers
apiRouters.post('/expenses', authToken, async (req, res) => {
  // const data = req.body;
  try {
    const { deductionType, description, amount, date } = req.body;
    const { email } = req.user;
    if (deductionType && description && amount && date) {
      const tax = parseInt(amount) * .12;
      const addExpenses = await new Expenses({ deductionType, description, amount: parseInt(amount) + tax, date, processBy: email }).save();
      return res.json({
        code: 200,
        message: 'Expenses Added Successfully.'
      })
    }
    return res.status(400).json({
      code: 400,
      message: 'Expenses Added Successfully.'
    })
  } catch (err) {
    console.log(err)
  }
})

apiRouters.get('/expenses', async (req, res) => {
  try {
    const { dFrom, dTo } = req.query;
    if (dFrom && dTo) {
      const inputTo = new Date(dTo);
      const inputFrom = new Date(dFrom);
      const retrieveExpenses = await Expenses.find({
        date: {
          $gte: inputFrom,
          $lte: inputTo.setDate(inputTo.getDate() + 1)
        }
      })
      return res.json({
        statistics: {
          amount: retrieveExpenses.reduce((acc, val) => acc + val.amount, 0),
          total: retrieveExpenses.length,
          rangeDate: {
            from: dFrom,
            to: dTo
          }
        },
        data: retrieveExpenses
      })
    }

  } catch (err) {
    console.log(err)
  }
})

apiRouters.get('/expenses/:id', authToken, async (req, res) => {
  try {
    const { id } = req.params;
    const retrieveExpenses = await Expenses.findOne({ _id: id })
    res.json(retrieveExpenses)
  } catch (err) {
    console.log(err)
  }
})

apiRouters.put('/expenses/:id', authToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { deductionType, description, amount, date } = req.body;
    const updateExpenses = await Expenses.update({ _id: id }, { deductionType, description, amount, date })
    res.json({
      code: 200,
      message: 'Updated Successfully.'
    })
  } catch (err) {
    console.log(err)
  }
})

apiRouters.delete('/expenses/:id', authToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteExpenses = await Expenses.deleteOne({ _id: id })
    res.json({
      code: 200,
      message: 'Deleted Successfully.'
    })
  } catch (err) {
    console.log(err)
  }
})
// End Expenses Routers

// Start Balance Sheet Routers
apiRouters.get("/sales", async (req, res) => {
  const data = await Billing.aggregate(
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
          Sales: {
            $sum: "$total",
          },
        },
      },
      {
        $project: {
          Sales: "$Sales",
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

  res.json({ success: true, data: data });
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
  const totalSale = await Billing.aggregate(
    [
      {
        $group: {
          _id: {
            Year: {
              $year: "$date",
            },
          },
          Sales: {
            $sum: "$total",
          },
        },
      },
    ],
    function (err, result) {
      return result;
    }
  );

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
apiRouters.post('/inventory', authToken, async (req, res) => {
  try {
    const { code, description, amount, date } = req.body;
    let vat = parseInt(amount) * .12
    const addInventory = await new Inventory({
      code,
      description,
      amount: parseInt(amount) + vat,
      date
    }).save();
    res.status(200).json({
      status: 200,
      message: 'Product created successfully.'
    })
  } catch (err) {
    console.log(err)
  }
})

apiRouters.get('/inventory', authToken, async (req, res) => {
  try {
    const { dTo, dFrom } = req.query;
    if (dTo && dFrom) {
      const inputTo = new Date(dTo);
      const inputFrom = new Date(dFrom);
      const productCodes = await Billing.distinct('productCode');
      const retrieveDate = await Inventory.aggregate([
        {
          $match: {
            date: {
              $gte: inputFrom,
              $lte: inputTo
            },
            code: { $nin: productCodes }
          }
        }
      ]);

      return res.json({
        statistics: {
          amount: retrieveDate.reduce((acc, val) => acc + val.amount, 0),
          total: retrieveDate.length,
          rangeDate: {
            from: dFrom,
            to: dTo
          }
        },
        data: retrieveDate
      });
    }

    const productCodes = await Billing.distinct("productCode");
    const retrieveData = await Inventory.find({ "code": { $nin: productCodes } });
    return res.json({
      statistics: {
        amount: retrieveData.reduce((acc, val) => acc + val.amount, 0),
        total: retrieveData.length,
      },
      data: retrieveData,
    });



  } catch (err) {
    console.log(err)
  }
})

apiRouters.get('/inventory/:id', authToken, async (req, res) => {
  try {
    const { id } = req.params
    const getInventory = await Inventory.findOne({ _id: id })
    res.json(getInventory)
  } catch (err) {
    console.log(err)
  }
})

apiRouters.put('/inventory/:id', authToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { code, description, amount, date } = req.body;
    const updateData = await Inventory.update({
      _id: id
    }, {
      $set: { code, description, amount, date }
    });
    res.json(updateData)
  } catch (err) {
    console.log(err)
  }
})

apiRouters.delete('/inventory/:id', authToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteData = await Inventory.deleteOne({ _id: id })
    res.json(deleteData)
  } catch (err) {
    console.log()
  }
})
// End Inventory Routers

mongoose.set('strictQuery', true)
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
