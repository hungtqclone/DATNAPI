const postModel = require("../models/PostnewsModels");
const moment = require("moment");

const getProduct = async () => {
  try {
    const product = await postModel
      .find()
      .populate(["userid", "brandid", "idCategory"]);
    return product;
  } catch (error) {
    console.log("get all produc error: ", error);
    return false;
  }
};

const getPostsHidden = async () => {
  try {
    const posts = await postModel
      .find({ activable: false })
      .populate(["userid", "brandid", "idCategory"]);
    return posts;
  } catch (error) {
    console.log("get all produc error: ", error);
    return false;
  }
};
const getPostsPresently = async () => {
  try {
    const posts = await postModel
      .find({ activable: true })
      .populate(["userid", "brandid", "idCategory"]);
    return posts;
  } catch (error) {
    console.log("get all produc error: ", error);
    return false;
  }
};

// get postnewsbyid
const getPostByid = async (id) => {
  try {
    const postid = await postModel
      .findById(id)
      .populate(["userid", "brandid", "idCategory"]);
    return postid;
  } catch (error) {
    return false;
  }
};

// get postnewsbyidUser
const getPostByidUser = async (userid) => {
  try {
    const postnewsByidUser = await postModel.find({ userid });
    const postnewsByidUserHidden = await postModel.find({
      userid,
      activable: false,
    });
    const postnewsByidUserPresently = await postModel.find({
      userid,
      activable: true,
    });
    console.log(
      "check data hidden: ",
      postnewsByidUserHidden,
      "check data presently",
      postnewsByidUserPresently
    );
    const postById = {
      posts: postnewsByidUser,
      postsHidden: postnewsByidUserHidden,
      postsPresently: postnewsByidUserPresently,
    };
    return postById;
  } catch (error) {
    return false;
  }
};

// get postnewsbyid Categoory
const getPostByidCategory = async (idCategory) => {
  try {
    const currentDate = new Date();

    // Lấy tất cả các bài viết trong danh mục
    const allPosts = await postModel.find({
      idCategory: idCategory,
      activable: true,
    });

    // Kiểm tra và cập nhật trạng thái isVip của các bài viết
    await Promise.all(allPosts.map(async (post) => {
      if (post.isVip && post.endVip < currentDate) {
        post.isVip = false;
        await post.save();
      }
    }));

    // Sắp xếp các bài viết sao cho các bài viết VIP sẽ hiển thị trước, sau đó là các bài viết thông thường
    const sortedPosts = allPosts.sort((a, b) => {
      // Các điều kiện sắp xếp ở đây giữ nguyên như cách bạn đã viết trong bài viết gốc
      if (a.isVip && a.endVip >= currentDate && (!b.isVip || b.endVip < currentDate)) {
        return -1; // a sẽ được đưa lên trước
      } else if (b.isVip && b.endVip >= currentDate && (!a.isVip || a.endVip < currentDate)) {
        return 1; // b sẽ được đưa lên trước
      } else {
        return new Date(b.created_AT) - new Date(a.created_AT);
      }
    });

    return sortedPosts;
  } catch (error) {
    console.error(error);
    return false;
  }
};

//add
const addProduct = async (productData) => {
  try {
    const newProduct = new postModel(productData);
    const savedProduct = await newProduct.save();
    return savedProduct;
  } catch (error) {
    return false;
  }
};
// edit
const updateProduct = async (
  id,
  title,
  status,
  detail,
  location,
  price,
  created_AT,
  files,
  role,
  activable,
  properties
) => {
  try {
    const updatedProduct = await postModel.findByIdAndUpdate(
      id,
      {
        title,
        status,
        detail,
        location,
        price,
        created_AT,
        files,
        role,
        activable,
        properties,
      },
      { new: true }
    );
    return updatedProduct;
  } catch (error) {
    return false;
  }
};

const deleteProduct = async (id) => {
  try {
    const deletedProduct = await postModel.findByIdAndDelete(id);
    return deletedProduct;
  } catch (error) {
    return false;
  }
};

// tiềm kiếm theo title
const searchProductByTitle = async (title) => {
  try {
    const products = await postModel.find({
      title: { $regex: new RegExp(title, "i") },
    });
    return products;
  } catch (error) {
    console.error(error);
    return false;
  }
};
// Time end
const getTimeEndPostNews = async () => {
  try {
    const vips = await postModel.find({ endVip: { $gte: moment() } });
    return vips;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const postNews = async (
  title,
  status,
  detail,
  location,
  price,
  created_AT,
  role,
  activable,
  properties,
  userid,
  brandid,
  filePaths
) => {
  try {
    const newProduct = new postModel({
      title,
      status,
      detail,
      location,
      price,
      created_AT,
      files: filePaths, // Save the file paths here
      role,
      activable,
      properties,
      userid,
      brandid,
    });
    const savedProduct = await newProduct.save();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const uploadImagesbyID = async (id, filePaths) => {
  try {
    const existingProduct = await postModel.findById(id);
    const updatedFiles = existingProduct.files.concat(filePaths);
    const updatedProduct = await postModel.findByIdAndUpdate(
      id,
      { files: updatedFiles },
      { new: true }
    );
    return updatedProduct;
  } catch (error) {
    return false;
  }
};

const isActivable = async (idPosts) => {
  try {
    const posts = await postModel.findById(idPosts);
    const newActivable = !posts.activable;
    const updatePosts = await postModel.findByIdAndUpdate(
      idPosts,
      { activable: newActivable },
      { new: true }
    );
    return updatePosts;
  } catch (error) {
    return false;
  }
};

const createVipPosts = async (id, numberOfDays) => {
  try {
    let now = moment();
    let endVip = now.add(numberOfDays, "days");
    const updatedPosts = await postModel.findOneAndUpdate(
      { _id: id },
      { $set: { endVip: endVip, isVip: true } },
      { new: true }
    );
    return updatedPosts;
  } catch (error) {
    console.log("services: create vip posts error", error);
    return false;
  }
};

module.exports = {
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  searchProductByTitle,
  postNews,
  uploadImagesbyID,
  getPostByidUser,
  getPostByidCategory,
  isActivable,
  getPostsHidden,
  getPostsPresently,
  getPostByid,
  getTimeEndPostNews,
  createVipPosts,
};
