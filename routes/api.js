var express = require("express");
var router = express.Router();

const Distributors = require("../model/distributors");
const Fruits = require("../model/fruits");
const Users = require("../model/user");
const Upload = require("../config/common/upload");
const Transporter = require("../config/common/mail");

//Add distributor
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

//Add fruti
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

//Get list fruit
router.get("/get-list-fruit", async (rq, rs) => {
  const authHeader = rq.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return rs.sendStatus(401);
  let payload;
  JWT.verify(token, SECRETKEY, (err, _payload) => {
    if (err instanceof JWT.TokenExpiredError) return rs.sendStatus(401);
    if (err) return rs.sendStatus(403);

    payload = _payload;
  });
  console.log(payload);

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

//get fruit by id
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

//get list fruit in price
router.get("/get-list-fruit-in-price", async (rq, rs) => {
  try {
    const { price_start, price_end } = rq.query;

    const query = { price: { $gte: price_start, $lte: price_end } };
    const data = await Fruits.find(query, "name quantity price id_distributors")
      .populate("id_distributors")
      .sort({ quantity: -1 })
      .skip(0)
      .limit(3); //Lấy 3 sản phẩm
    rs.json({
      status: 200,
      messenger: "List fruit",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});

//get list fruit have name a or x
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

//update fruit by id
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
// add user
router.post("/add-user", async (rq, rs) => {
  try {
    const data = rq.body;
    const newUser = new Users({
      username: data.username,
      password: data.password,
      email: data.email,
      name: data.name,
      avatar: data.avatar,
    });
    const reslut = await newUser.save();
    if (reslut) {
      rs.json({
        status: 200,
        messenger: "Add user successfully",
        data: data,
      });
    } else {
      rs.json({
        status: 400,
        messenger: "Erro add user failed",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// <=====Start Lab4====>

//delete fruit
router.delete("/delete-fruit-by-id/:id", async (rq, rs) => {
  try {
    const { id } = rq.params;
    const result = await Fruits.findByIdAndDelete(id);
    if (result) {
      rs.json({
        status: 200,
        messenger: "Delete successfully",
        data: result,
      });
    } else {
      rs.json({
        status: 400,
        messenger: "Erro delete failed",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//Upload
router.post(
  "/add-fruit-with-file-image",
  Upload.array("image", 5),
  async (rq, rs) => {
    try {
      const data = rq.body;
      const { files } = rq; //Lấy dữ liêu từ body,
      const urlsImage = files.map(
        (file) => `${rq.protocol}://${rq.get("host")}/uploads/${file.filename}`
      );
      const newFruit = new Fruits({
        name: data.name,
        quantity: data.quantity,
        price: data.price,
        status: data.status,
        image: urlsImage, // Thêm url hình
        discriptions: data.discriptions,
        id_distributors: data.id_distributors,
      }); //Tạo mới một đối tượng

      const result = await newFruit.save(); //Thêm vào database

      if (result) {
        rs.json({
          status: 200,
          messenger: "Add successfully",
          data: result,
        });
      } else {
        rs.json({
          status: 400,
          messenger: "Erro add failed",
          data: [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

//send maill
router.post("/register-send-maill", Upload.single("avatar"), async (rq, rs) => {
  try {
    const data = rq.body;
    const { file } = rq;
    const newUser = Users({
      username: data.username,
      password: data.password,
      email: data.email,
      name: data.name,
      avatar: `${rq.protocol}://${rq.get("host")}/uploads/${file.filename}`,
    });
    const result = await newUser.save();
    if (result) {
      //gửi mail
      const mailOptions = {
        from: "nguyentatcong10x@gmail.com",
        to: result.email,
        subject: "Register successfully",
        text: "Thank you for register",
      };
      await Transporter.sendMail(mailOptions);
      rs.json({
        status: 200,
        messenger: "Add successfully",
        data: result,
      });
    } else {
      rs.json({
        status: 400,
        messenger: "Erro add failed",
        data: [],
      });
    }
  } catch (error) {
    console.log("ERRO NÈ", error);
  }
});

//Login jsonwebtoken
const JWT = require("jsonwebtoken");
const SECRETKEY = "NGUYENCONG";

router.post("/login", async (rq, rs) => {
  try {
    const { username, password } = rq.body;
    const user = await Users.findOne({ username, password });

    if (user) {
      const token = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: "1h" });
      const refresh = JWT.sign({ id: user._id }, SECRETKEY, {
        expiresIn: "1h",
      });
      rs.json({
        status: 200,
        messenger: "Login successfully",
        data: user,
        token: token,
        refresh: refresh,
      });
    } else {
      rs.json({
        status: 200,
        messenger: "Login Failed",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// <=====End Lab4====>

module.exports = router;
