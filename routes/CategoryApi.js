const express = require('express')
const router = express.Router();
const categoryController = require('../controllers/CategoryController');
const upload = require('../middleware/upload');

// lấy danh sách 
router.get('/', async (req, res) => {
    await categoryController.getCategory(res);
});

// add Ads
router.post('/add', categoryController.addCategory);

//byParentId
router.get('/:parentId', categoryController.getCategoryByparentId);

// delete
router.delete('/delete/:id', categoryController.deleteCategory);

//edit
router.post('/edit/:id', categoryController.updateCategory);

// upload-image
router.post('/upload-img', upload.single('image'), categoryController.upLoadImg);

// search
router.get('/search/:name', categoryController.searchCategoryByname);


module.exports = router