import Blog from "../models/BlogModel.js";
import { Op } from "sequelize";

export const getBlog = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Blog.count({
        where: {
            [Op.or]: [{
                title: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                description: {
                    [Op.like]: '%' + search + '%'
                }
            }]
        }
    });
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Blog.findAll({
        where: {
            [Op.or]: [{
                title: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                description: {
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
    });
}

export const getBlogById = async (req, res) => {
    try {
        const response = await Blog.findOne({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createBlog = async (req, res) => {
    const { title, description, status } = req.body;
    if (!title || !description || !status) {
        res.status(400).json({
            msgErr: "Data belum lengkap!"
        })
    } else {
        const blog = await Blog.findOne({
            where: {
                title: title
            }
        })
        if (blog) {
            res.status(400).json({
                dsu: "Data sudah ada!"
            })
        } else {
            await Blog.create({
                title: title,
                description: description,
                status: status
            });
            res.status(201).json({
                success: "Blog Created!"
            });
        }
    }
}

export const updateBlog = async (req, res) => {
    const { title, description, status } = req.body;

    if (!title || !description || !status) {
        res.status(400).json({
            dbl: "Data Belum Lengkap!"
        })
    } else {
        await Blog.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({
            success: "Blog Updated!"
        })
    }
}

export const deleteBlog = async (req, res) => {
    try {
        await Blog.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ dp: "Blog Deleted" });
    } catch (error) {
        console.log(error.message);
    }
}

