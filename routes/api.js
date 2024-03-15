var express = require("express");
var router = express.Router();

const Distributors = require("../model/distributors");
const Fruits = require("../model/fruits");

router.post("/add-distributor", async (req, res) => {
  try {
    const data = req.body;
    const newDis = new Distributors({
      nameDis: data.nameDis,
    });
    const result = await newDis.save();
    if (result) {
      res.json({
        status: 200,
        messenger: "Add successfully",
        data: result,
      });
    } else {
      res.json({
        status: 400,
        messenger: "Erro add failed",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    console.log("faaaa");
  }
});
router.post("/add-fruit", async (req, res) => {
  try {
    const data = req.body;
    const newFruit = new Fruits({
      name: data.name,
      quantity: data.quantity,
      price: data.price,
      status: data.status,
      image: data.image,
      discriptions: data.discriptions,
      id_distributors: data.id_distributors,
    });
    const result = await newFruit.save();
    if (result) {
      res.json({
        status: 200,
        messenger: "Add frutis successfully",
        data: result,
      });
    } else {
      res.json({
        status: 400,
        messenger: "Erro, add frutis failed ",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});
router.get("/get-list-fruit", async (rq, rs) => {
  try {
    const data = await Fruits.find().populate("id_distributors");
    rs.json({
      status: 200,
      messenger: "List fruit",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-fruit-by-id/:id", async (rq, rs) => {
  try {
    const { id } = rq.params;
    const data = await Fruits.findById(id).populate("id_distributors");
    rs.json({
      status: 200,
      messenger: "List fruit by id",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-list-fruit-in-price", async (rq, rs) => {
  try {
    const { price_start, price_end } = rq.query;

    const query = { price: { $gte: price_start, $lte: price_end } };
    const data = await Fruits.find(query, "name quantity price id distributor")
      .populate("id_distributors")
      .sort({ quantity: -1 })
      .skip(0)
      .limit(2);
    rs.json({
      status: 200,
      messenger: "List fruit",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-list-fruit-have-name-a-or-x", async (rq, rs) => {
  try {
    const query = {
      $or: [{ name: { $regex: "T" } }, { name: { $regex: "X" } }],
    };
    const data = await Fruits.find(
      query,
      "name quantity price id_distributor"
    ).populate("id_distributors");

    rs.json({
      status: 200,
      messenger: "List fruit",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/update-fruit-by-id/:id", async (rq, rs) => {
  try {
    const { id } = rq.params;
    const data = rq.body;
    const updateFruit = await Fruits.findById(id);
    let result = null;
    if (updateFruit) {
      updateFruit.name = data.name ?? updateFruit.name;
      updateFruit.quantity = data.quantity ?? updateFruit.quantity;
      updateFruit.price = data.price ?? updateFruit.price;
      updateFruit.status = data.status ?? updateFruit.status;
      updateFruit.image = data.image ?? updateFruit.image;
      updateFruit.discriptions = data.discriptions ?? updateFruit.discriptions;
      updateFruit.id_distributors =
        data.id_distributors ?? updateFruit.id_distributors;
      result = await updateFruit.save();
    }
    if (result) {
      rs.json({
        status: 200,
        messenger: "Update successfully",
        data: result,
      });
    } else {
      rs.json({
        status: 400,
        messenger: "Erro, update falied",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
