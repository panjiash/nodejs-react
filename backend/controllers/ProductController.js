import Product from "../models/ProductModel.js";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";

export const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search_query || "";
        const offset = limit * page;
        const totalRows = await Product.count({
            where: {
                [Op.or]: [{
                    name: {
                        [Op.like]: '%' + search + '%'
                    }
                }]
            }
        })
        const totalPage = Math.ceil(totalRows / limit);
        const result = await Product.findAll({
            where: {
                [Op.or]: [{
                    name: {
                        [Op.like]: '%' + search + '%'
                    }
                }]
            },
            offset: offset,
            limit: limit,
            order: [
                ['id', 'DESC']
            ]
        });
        res.json({
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage,
            result: result
        })
    } catch (error) {
        console.log(error.message);
    }
}

export const getProductById = async (req, res) => {
    try {
        const response = await Product.findOne({
            where: {
                id: req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const saveProduct = async (req, res) => {
    if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });
    const name = req.body.title;
    const product = await Product.findOne({
        where: {
            name: name
        }
    })
    console.log(product);
    if (product) {
        res.status(400).json({
            dsu: "Title sudah digunakan"
        })
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
        if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

        file.mv(`./public/images/${fileName}`, async (err) => {
            if (err) return res.status(500).json({ msg: err.message });
            try {
                await Product.create({ name: name, image: fileName, url: url });
                res.status(201).json({ msg: "Product Created Successfuly" });
            } catch (error) {
                console.log(error.message);
            }
        })
    }


}

export const updateProduct = async (req, res) => {
    const product = await Product.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!product) return res.status(404).json({ msg: "No Data Found" });

    let fileName = "";
    if (req.files === null) {
        fileName = product.image;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
        if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }
    const name = req.body.title;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    try {
        await Product.update({ name: name, image: fileName, url: url }, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "Product Updated Successfuly" });
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteProduct = async (req, res) => {
    const product = await Product.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!product) return res.status(404).json({ msg: "No Data Found" });

    try {
        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);
        await Product.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "Product Deleted Successfuly" });
    } catch (error) {
        console.log(error.message);
    }
}
