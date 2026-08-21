const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true
    },

    manufacturerId: {
      type: String,
      required: true
    },

    customerId: {
      type: String,
      default: ""
    },

    productId: {
      type: String,
      default: ""
    },

    date: {
      type: String,
      default: ""
    },

    customer: {
      type: String,
      required: true
    },

    customerPhone: {
      type: String,
      default: ""
    },

    customerEmail: {
      type: String,
      default: ""
    },

    address: {
      type: String,
      default: ""
    },

    pincode: {
      type: String,
      default: ""
    },

    city: {
      type: String,
      default: ""
    },

    state: {
      type: String,
      default: ""
    },

    product: {
      type: String,
      required: true
    },

    category: {
      type: String,
      default: "Silk"
    },

    quantity: {
      type: Number,
      default: 1
    },

    price: {
      type: Number,
      default: 0
    },

    amount: {
      type: String,
      default: "₹0"
    },

    payment: {
      type: String,
      default: "Paid"
    },

    status: {
      type: String,
      default: "Pending"
    },

    deliveryNotes: {
      type: String,
      default: ""
    }
  },
  {
    collection: "Orders",
    timestamps: true,
    strict: true
  }
);

const OrderModel =
  mongoose.models.Order ||
  mongoose.model("Order", orderSchema, "Orders");

const getStatusClass = (status) => {
  if (
    status === "Completed" ||
    status === "Delivered"
  ) {
    return "bg-[#EAF6ED] text-[#2E7D32] border-[#C8E6C9]";
  }

  if (status === "In Production") {
    return "bg-[#FFF4DF] text-[#A16B16] border-[#F5DEC0]";
  }

  if (status === "Quality Check") {
    return "bg-[#F4EAFA] text-[#704C91] border-[#E8D4F5]";
  }

  if (status === "Ready to Ship") {
    return "bg-[#E6F4FA] text-[#1E6589] border-[#C9E7F6]";
  }

  return "bg-[#FBEEEE] text-[#A44747] border-[#F4CFCF]";
};

router.get("/", async (req, res) => {
  try {
    const {
      status,
      search,
      manufacturerId
    } = req.query;

    const query = {};

    if (
      manufacturerId &&
      manufacturerId.trim() &&
      manufacturerId !== "All"
    ) {
      query.manufacturerId = manufacturerId.trim();
    }

    if (
      status &&
      status !== "All"
    ) {
      query.status = status;
    }

    if (search && search.trim()) {
      const searchText = search.trim();

      query.$or = [
        {
          orderId: {
            $regex: searchText,
            $options: "i"
          }
        },
        {
          customerId: {
            $regex: searchText,
            $options: "i"
          }
        },
        {
          productId: {
            $regex: searchText,
            $options: "i"
          }
        },
        {
          customer: {
            $regex: searchText,
            $options: "i"
          }
        },
        {
          product: {
            $regex: searchText,
            $options: "i"
          }
        },
        {
          customerEmail: {
            $regex: searchText,
            $options: "i"
          }
        },
        {
          customerPhone: {
            $regex: searchText,
            $options: "i"
          }
        },
        {
          address: {
            $regex: searchText,
            $options: "i"
          }
        },
        {
          city: {
            $regex: searchText,
            $options: "i"
          }
        },
        {
          state: {
            $regex: searchText,
            $options: "i"
          }
        },
        {
          pincode: {
            $regex: searchText,
            $options: "i"
          }
        }
      ];
    }

    const orders = await OrderModel
      .find(query)
      .sort({ createdAt: -1 })
      .lean();

    const formattedOrders = orders.map((order) => ({
      id: order._id,
      _id: order._id,

      orderId: order.orderId || "",

      manufacturerId:
        order.manufacturerId || "",

      customerId:
        order.customerId || "",

      productId:
        order.productId || "",

      date:
        order.date || "",

      customer:
        order.customer || "",

      customerPhone:
        order.customerPhone || "",

      customerEmail:
        order.customerEmail || "",

      address:
        order.address || "",

      pincode:
        order.pincode || "",

      city:
        order.city || "",

      state:
        order.state || "",

      product:
        order.product || "",

      category:
        order.category || "",

      quantity:
        order.quantity || 1,

      price:
        order.price || 0,

      amount:
        order.amount || "₹0",

      payment:
        order.payment || "Paid",

      status:
        order.status || "Pending",

      deliveryNotes:
        order.deliveryNotes || "",

      statusClass:
        getStatusClass(
          order.status || "Pending"
        )
    }));

    return res.json({
      status: "success",
      count: formattedOrders.length,
      data: formattedOrders
    });

  } catch (error) {
    console.error(
      "Orders Fetch Error:",
      error
    );

    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let order;

    if (
      mongoose.Types.ObjectId.isValid(id)
    ) {
      order =
        await OrderModel
          .findById(id)
          .lean();
    } else {
      order =
        await OrderModel
          .findOne({
            orderId: id
          })
          .lean();
    }

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found"
      });
    }

    return res.json({
      status: "success",

      data: {
        id: order._id,
        _id: order._id,

        orderId:
          order.orderId || "",

        manufacturerId:
          order.manufacturerId || "",

        customerId:
          order.customerId || "",

        productId:
          order.productId || "",

        date:
          order.date || "",

        customer:
          order.customer || "",

        customerPhone:
          order.customerPhone || "",

        customerEmail:
          order.customerEmail || "",

        address:
          order.address || "",

        pincode:
          order.pincode || "",

        city:
          order.city || "",

        state:
          order.state || "",

        product:
          order.product || "",

        category:
          order.category || "",

        quantity:
          order.quantity || 1,

        price:
          order.price || 0,

        amount:
          order.amount || "₹0",

        payment:
          order.payment || "Paid",

        status:
          order.status || "Pending",

        deliveryNotes:
          order.deliveryNotes || "",

        statusClass:
          getStatusClass(
            order.status || "Pending"
          )
      }
    });

  } catch (error) {
    console.error(
      "Single Order Error:",
      error
    );

    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      orderId,
      manufacturerId,
      customerId,
      productId,
      date,
      customer,
      customerPhone,
      customerEmail,
      address,
      pincode,
      city,
      state,
      product,
      category,
      quantity,
      price,
      amount,
      payment,
      status,
      deliveryNotes
    } = req.body;

    if (!customer) {
      return res.status(400).json({
        status: "error",
        message: "Customer is required"
      });
    }

    if (!product) {
      return res.status(400).json({
        status: "error",
        message: "Product is required"
      });
    }

    const count =
      await OrderModel.countDocuments();

    const generatedOrderId =
      orderId ||
      `VAS${1025 + count}`;

    const qty =
      Number(quantity) || 1;

    const finalAmount =
      amount ||
      (
        price
          ? `₹${(
            Number(price) * qty
          ).toLocaleString("en-IN")}`
          : "₹0"
      );

    const newOrder =
      await OrderModel.create({
        orderId: generatedOrderId,

        manufacturerId:
          manufacturerId ||
          "rithikeswaran.it23@bitsathy.ac.in",

        customerId:
          customerId ||
          `CUSTOMER${String(
            count + 1
          ).padStart(3, "0")}`,

        productId:
          productId || "",

        date:
          date ||
          new Date().toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "numeric"
            }
          ),

        customer:
          customer.trim(),

        customerPhone:
          customerPhone || "",

        customerEmail:
          customerEmail || "",

        address:
          address || "",

        pincode:
          pincode || "",

        city:
          city || "",

        state:
          state || "",

        product:
          product.trim(),

        category:
          category || "Silk",

        quantity:
          qty,

        price:
          Number(price) || 0,

        amount:
          finalAmount,

        payment:
          payment || "Paid",

        status:
          status || "Pending",

        deliveryNotes:
          deliveryNotes || ""
      });

    return res.status(201).json({
      status: "success",
      message:
        "Order created successfully",
      data: newOrder
    });

  } catch (error) {
    console.error(
      "Order Create Error:",
      error
    );

    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        status: "error",
        message: "Status is required"
      });
    }

    let updated;

    if (
      mongoose.Types.ObjectId.isValid(id)
    ) {
      updated =
        await OrderModel.findByIdAndUpdate(
          id,
          {
            status
          },
          {
            new: true
          }
        );
    } else {
      updated =
        await OrderModel.findOneAndUpdate(
          {
            orderId: id
          },
          {
            status
          },
          {
            new: true
          }
        );
    }

    if (!updated) {
      return res.status(404).json({
        status: "error",
        message: "Order not found"
      });
    }

    return res.json({
      status: "success",
      message:
        "Order status updated successfully",
      data: updated
    });

  } catch (error) {
    console.error(
      "Order Status Update Error:",
      error
    );

    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let deleted;

    if (
      mongoose.Types.ObjectId.isValid(id)
    ) {
      deleted =
        await OrderModel.findByIdAndDelete(id);
    } else {
      deleted =
        await OrderModel.findOneAndDelete({
          orderId: id
        });
    }

    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Order not found"
      });
    }

    return res.json({
      status: "success",
      message:
        "Order deleted successfully",
      data: deleted
    });

  } catch (error) {
    console.error(
      "Order Delete Error:",
      error
    );

    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

module.exports = router;